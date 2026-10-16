from typing import Any, Dict, List, Optional

VAULT_DATA: Dict[str, Dict[str, Any]] = {
    "npm:express@4.16.0": {
        "system": "npm",
        "package": "express",
        "version": "4.16.0",
        "packages": [
            {"name": "express", "version": "4.16.0", "relation": "root", "clean_version": "4.19.2"},
            {"name": "body-parser", "version": "1.18.2", "relation": "direct", "clean_version": "1.19.0", "semver_type": "minor"},
            {"name": "qs", "version": "6.5.1", "relation": "transitive", "clean_version": "6.5.3", "semver_type": "patch"},
            {"name": "raw-body", "version": "2.3.2", "relation": "transitive", "clean_version": "2.3.3", "semver_type": "patch"},
            {"name": "send", "version": "0.16.0", "relation": "direct", "clean_version": "0.18.0", "semver_type": "minor"},
            {"name": "serve-static", "version": "1.13.0", "relation": "direct", "clean_version": "1.14.0", "semver_type": "minor"},
            {"name": "cookie", "version": "0.3.1", "relation": "direct", "clean_version": "0.4.0", "semver_type": "minor"},
            {"name": "path-to-regexp", "version": "0.1.7", "relation": "direct", "clean_version": "0.1.10", "semver_type": "patch"},
            {"name": "mime", "version": "1.4.1", "relation": "transitive", "clean_version": "1.6.0", "semver_type": "minor"},
            {"name": "statuses", "version": "1.3.1", "relation": "transitive", "clean_version": "1.5.0", "semver_type": "minor"},
        ],
        "dependencies": [
            ("express@4.16.0", "body-parser@1.18.2"),
            ("express@4.16.0", "send@0.16.0"),
            ("express@4.16.0", "serve-static@1.13.0"),
            ("express@4.16.0", "cookie@0.3.1"),
            ("express@4.16.0", "path-to-regexp@0.1.7"),
            ("body-parser@1.18.2", "qs@6.5.1"),
            ("body-parser@1.18.2", "raw-body@2.3.2"),
            ("send@0.16.0", "mime@1.4.1"),
            ("send@0.16.0", "statuses@1.3.1"),
            ("serve-static@1.13.0", "send@0.16.0"),
        ],
        "advisories": [
            {
                "package": "qs@6.5.1",
                "id": "GHSA-hrpp-h998-j3pp",
                "cvss3": 7.5,
                "severity": "HIGH",
                "summary": "Prototype Pollution in qs prior to 6.5.3 allows remote code execution via bracket-parsing."
            },
            {
                "package": "send@0.16.0",
                "id": "GHSA-m6fv-jmc7-4pcq",
                "cvss3": 8.6,
                "severity": "HIGH",
                "summary": "Root directory traversal vulnerability in send leading to unauthorized arbitrary file access."
            },
            {
                "package": "raw-body@2.3.2",
                "id": "GHSA-952p-6rrq-rcjv",
                "cvss3": 7.1,
                "severity": "HIGH",
                "summary": "Unchecked stream length parsing in raw-body causes unhandled denial of service."
            }
        ]
    },
    "npm:mocha@8.0.0": {
        "system": "npm",
        "package": "mocha",
        "version": "8.0.0",
        "packages": [
            {"name": "mocha", "version": "8.0.0", "relation": "root", "clean_version": "8.4.0"},
            {"name": "glob", "version": "7.1.6", "relation": "direct", "clean_version": "7.2.0", "semver_type": "minor"},
            {"name": "minimatch", "version": "3.0.4", "relation": "transitive", "clean_version": "3.1.2", "semver_type": "patch"},
            {"name": "brace-expansion", "version": "1.1.11", "relation": "transitive", "clean_version": "1.1.11", "semver_type": "patch"},
            {"name": "chokidar", "version": "3.4.0", "relation": "direct", "clean_version": "3.5.0", "semver_type": "minor"},
            {"name": "anymatch", "version": "3.1.1", "relation": "transitive", "clean_version": "3.1.2", "semver_type": "patch"},
        ],
        "dependencies": [
            ("mocha@8.0.0", "glob@7.1.6"),
            ("mocha@8.0.0", "chokidar@3.4.0"),
            ("glob@7.1.6", "minimatch@3.0.4"),
            ("minimatch@3.0.4", "brace-expansion@1.1.11"),
            ("chokidar@3.4.0", "anymatch@3.1.1"),
        ],
        "advisories": [
            {
                "package": "minimatch@3.0.4",
                "id": "GHSA-f8q6-p94x-37v3",
                "cvss3": 7.5,
                "severity": "HIGH",
                "summary": "Regular Expression Denial of Service (ReDoS) in minimatch wildcard path matching."
            }
        ]
    },
    "npm:axios@0.21.1": {
        "system": "npm",
        "package": "axios",
        "version": "0.21.1",
        "packages": [
            {"name": "axios", "version": "0.21.1", "relation": "root", "clean_version": "0.21.4"},
            {"name": "follow-redirects", "version": "1.14.0", "relation": "direct", "clean_version": "1.14.9", "semver_type": "patch"},
        ],
        "dependencies": [
            ("axios@0.21.1", "follow-redirects@1.14.0"),
        ],
        "advisories": [
            {
                "package": "follow-redirects@1.14.0",
                "id": "GHSA-pw2r-vq6v-5hwc",
                "cvss3": 7.7,
                "severity": "HIGH",
                "summary": "Authorization HTTP Header Leakage across cross-domain redirects in follow-redirects."
            }
        ]
    },
    "npm:body-parser@1.18.2": {
        "system": "npm",
        "package": "body-parser",
        "version": "1.18.2",
        "packages": [
            {"name": "body-parser", "version": "1.18.2", "relation": "root", "clean_version": "1.19.0"},
            {"name": "qs", "version": "6.5.1", "relation": "direct", "clean_version": "6.5.3", "semver_type": "patch"},
            {"name": "raw-body", "version": "2.3.2", "relation": "direct", "clean_version": "2.3.3", "semver_type": "patch"},
            {"name": "bytes", "version": "3.0.0", "relation": "direct", "clean_version": "3.1.0", "semver_type": "minor"},
        ],
        "dependencies": [
            ("body-parser@1.18.2", "qs@6.5.1"),
            ("body-parser@1.18.2", "raw-body@2.3.2"),
            ("body-parser@1.18.2", "bytes@3.0.0"),
        ],
        "advisories": [
            {
                "package": "qs@6.5.1",
                "id": "GHSA-hrpp-h998-j3pp",
                "cvss3": 7.5,
                "severity": "HIGH",
                "summary": "Prototype Pollution in qs prior to 6.5.3 allows remote code execution via bracket-parsing."
            },
            {
                "package": "raw-body@2.3.2",
                "id": "GHSA-952p-6rrq-rcjv",
                "cvss3": 7.1,
                "severity": "HIGH",
                "summary": "Unchecked stream length parsing in raw-body causes unhandled denial of service."
            }
        ]
    }
}

class SnapshotVault:
    @staticmethod
    def get_snapshot(system: str, package: str, version: str) -> Optional[Dict[str, Any]]:
        key = f"{system.lower()}:{package}@{version}"
        return VAULT_DATA.get(key)

    @staticmethod
    def list_presets() -> List[Dict[str, str]]:
        presets = []
        for key, val in VAULT_DATA.items():
            presets.append({
                "key": key,
                "system": val["system"],
                "package": val["package"],
                "version": val["version"],
                "vulnerabilities_count": len(val["advisories"]),
                "direct_deps_count": sum(1 for p in val["packages"] if p.get("relation") == "direct")
            })
        return presets
