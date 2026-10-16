import logging
import urllib.parse
import requests
from typing import Any, Dict, List, Optional

logger = logging.getLogger("chokepoint.resolver")

class LiveResolver:
    BASE_URL = "https://api.deps.dev/v3alpha"

    SYSTEM_MAP = {
        "npm": "npm",
        "pypi": "pypi",
        "cargo": "cargo",
        "go": "go",
        "maven": "maven",
        "nuget": "nuget"
    }

    @classmethod
    def resolve_package(cls, system: str, package: str, version: str) -> Optional[Dict[str, Any]]:
        """
        Attempts to fetch live dependencies and advisories from deps.dev
        for npm, PyPI, Cargo, Go, Maven, and NuGet.
        """
        sys_code = cls.SYSTEM_MAP.get(system.lower(), system.lower())
        pkg_enc = urllib.parse.quote(package, safe="")
        
        # 1. Fetch version details (advisories)
        ver_url = f"{cls.BASE_URL}/systems/{sys_code}/packages/{pkg_enc}/versions/{version}"
        advisories: List[Dict[str, Any]] = []
        try:
            ver_resp = requests.get(ver_url, timeout=5)
            if ver_resp.status_code == 200:
                ver_data = ver_resp.json()
                for adv in ver_data.get("advisoryKeys", []):
                    adv_id = adv.get("id", "UNKNOWN-CVE")
                    advisories.append({
                        "package": f"{package}@{version}",
                        "id": adv_id,
                        "cvss3": 7.8,
                        "severity": "HIGH",
                        "summary": f"Live security advisory {adv_id} detected in upstream registry."
                    })
        except Exception as e:
            logger.warning(f"Failed to fetch live version info for {package}@{version}: {e}")

        # 2. Fetch live dependency tree
        dep_url = f"{cls.BASE_URL}/systems/{sys_code}/packages/{pkg_enc}/versions/{version}:dependencies"
        try:
            dep_resp = requests.get(dep_url, timeout=5)
            if dep_resp.status_code != 200:
                logger.warning(f"deps.dev dependencies returned {dep_resp.status_code} for {package}@{version}")
                if advisories:
                    return {
                        "system": system,
                        "package": package,
                        "version": version,
                        "packages": [{"name": package, "version": version, "relation": "root"}],
                        "dependencies": [],
                        "advisories": advisories
                    }
                return None

            data = dep_resp.json()
            nodes = data.get("nodes", [])
            edges = data.get("edges", [])

            packages: List[Dict[str, Any]] = []
            node_key_map: Dict[int, str] = {}

            for idx, n in enumerate(nodes):
                vk = n.get("versionKey", {})
                p_name = vk.get("name", f"pkg-{idx}")
                p_ver = vk.get("version", "0.0.0")
                relation_raw = n.get("relation", "INDIRECT").upper()
                if relation_raw == "SELF":
                    rel = "root"
                elif relation_raw == "DIRECT":
                    rel = "direct"
                else:
                    rel = "transitive"

                packages.append({
                    "name": p_name,
                    "version": p_ver,
                    "relation": rel,
                    "clean_version": p_ver,
                    "semver_type": "patch"
                })
                node_key_map[idx] = f"{p_name}@{p_ver}"

            dependencies: List[tuple] = []
            for e in edges:
                src_idx = e.get("fromNode")
                dst_idx = e.get("toNode")
                if src_idx in node_key_map and dst_idx in node_key_map:
                    dependencies.append((node_key_map[src_idx], node_key_map[dst_idx]))

            return {
                "system": system,
                "package": package,
                "version": version,
                "packages": packages,
                "dependencies": dependencies,
                "advisories": advisories
            }

        except Exception as e:
            logger.warning(f"Live resolver failed: {e}")
            return None

