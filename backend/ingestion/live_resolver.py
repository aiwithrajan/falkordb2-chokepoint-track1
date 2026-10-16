import logging
import requests
from typing import Any, Dict, Optional

logger = logging.getLogger("chokepoint.resolver")

class LiveResolver:
    BASE_URL = "https://api.deps.dev/v3alpha"

    @classmethod
    def resolve_package(cls, system: str, package: str, version: str) -> Optional[Dict[str, Any]]:
        """
        Attempts to fetch live dependencies and advisories from deps.dev.
        """
        sys_code = "npm" if system.lower() == "npm" else "pypi"
        url = f"{cls.BASE_URL}/systems/{sys_code}/packages/{package}/versions/{version}"
        try:
            resp = requests.get(url, timeout=5)
            if resp.status_code != 200:
                logger.warning(f"deps.dev returned status {resp.status_code} for {package}@{version}")
                return None
            data = resp.json()
            # Parse links and advisories
            return {
                "system": system,
                "package": package,
                "version": version,
                "live_data": data
            }
        except Exception as e:
            logger.warning(f"Live resolver failed (network/timeout): {e}")
            return None
