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
    },
    "pypi:requests@2.25.0": {
        "system": "pypi",
        "package": "requests",
        "version": "2.25.0",
        "packages": [
            {"name": "requests", "version": "2.25.0", "relation": "root", "clean_version": "2.28.2"},
            {"name": "urllib3", "version": "1.25.8", "relation": "direct", "clean_version": "1.26.5", "semver_type": "patch"},
            {"name": "chardet", "version": "3.0.4", "relation": "direct", "clean_version": "4.0.0", "semver_type": "minor"},
            {"name": "idna", "version": "2.10", "relation": "direct", "clean_version": "3.3", "semver_type": "minor"},
            {"name": "certifi", "version": "2020.12.5", "relation": "direct", "clean_version": "2023.7.22", "semver_type": "patch"},
        ],
        "dependencies": [
            ("requests@2.25.0", "urllib3@1.25.8"),
            ("requests@2.25.0", "chardet@3.0.4"),
            ("requests@2.25.0", "idna@2.10"),
            ("requests@2.25.0", "certifi@2020.12.5"),
        ],
        "advisories": [
            {
                "package": "urllib3@1.25.8",
                "id": "GHSA-r64q-w8jr-g9qp",
                "cvss3": 7.5,
                "severity": "HIGH",
                "summary": "CRLF injection and HTTP request smuggling via unencoded carriage returns in urllib3."
            }
        ]
    },
    "cargo:tokio@0.2.0": {
        "system": "cargo",
        "package": "tokio",
        "version": "0.2.0",
        "packages": [
            {"name": "tokio", "version": "0.2.0", "relation": "root", "clean_version": "0.2.25"},
            {"name": "bytes", "version": "0.4.12", "relation": "direct", "clean_version": "0.5.6", "semver_type": "minor"},
            {"name": "mio", "version": "0.6.21", "relation": "direct", "clean_version": "0.6.23", "semver_type": "patch"},
            {"name": "pin-project-lite", "version": "0.1.1", "relation": "direct", "clean_version": "0.2.0", "semver_type": "minor"},
            {"name": "net2", "version": "0.2.33", "relation": "transitive", "clean_version": "0.2.37", "semver_type": "patch"},
        ],
        "dependencies": [
            ("tokio@0.2.0", "bytes@0.4.12"),
            ("tokio@0.2.0", "mio@0.6.21"),
            ("tokio@0.2.0", "pin-project-lite@0.1.1"),
            ("mio@0.6.21", "net2@0.2.33"),
        ],
        "advisories": [
            {
                "package": "bytes@0.4.12",
                "id": "RUSTSEC-2020-0063",
                "cvss3": 8.1,
                "severity": "HIGH",
                "summary": "Memory safety violation / Use-After-Free in bytes::BytesMut due to unchecked buffer slice offsets."
            }
        ]
    },
    "maven:spring-boot-starter-log4j2@2.5.0": {
        "system": "maven",
        "package": "spring-boot-starter-log4j2",
        "version": "2.5.0",
        "packages": [
            {"name": "spring-boot-starter-log4j2", "version": "2.5.0", "relation": "root", "clean_version": "2.5.8"},
            {"name": "log4j-core", "version": "2.14.1", "relation": "direct", "clean_version": "2.17.1", "semver_type": "patch"},
            {"name": "log4j-api", "version": "2.14.1", "relation": "transitive", "clean_version": "2.17.1", "semver_type": "patch"},
        ],
        "dependencies": [
            ("spring-boot-starter-log4j2@2.5.0", "log4j-core@2.14.1"),
            ("log4j-core@2.14.1", "log4j-api@2.14.1"),
        ],
        "advisories": [
            {
                "package": "log4j-core@2.14.1",
                "id": "GHSA-jfh8-c2jp-5v3q",
                "cvss3": 10.0,
                "severity": "CRITICAL",
                "summary": "Log4Shell: Remote Code Execution via JNDI lookup vulnerability in Apache Log4j2 (CVE-2021-44228)."
            }
        ]
    },
    "go:gin@1.6.3": {
        "system": "go",
        "package": "gin",
        "version": "1.6.3",
        "packages": [
            {"name": "gin", "version": "1.6.3", "relation": "root", "clean_version": "1.7.4"},
            {"name": "crypto", "version": "0.0.1", "relation": "direct", "clean_version": "0.1.0", "semver_type": "patch"},
            {"name": "sys", "version": "0.0.1", "relation": "transitive", "clean_version": "0.1.0", "semver_type": "patch"},
        ],
        "dependencies": [
            ("gin@1.6.3", "crypto@0.0.1"),
            ("crypto@0.0.1", "sys@0.0.1"),
        ],
        "advisories": [
            {
                "package": "crypto@0.0.1",
                "id": "GHSA-x4vf-92v8-55p9",
                "cvss3": 7.5,
                "severity": "HIGH",
                "summary": "Incorrect calculation in curve operations allows elliptic curve key recovery in golang.org/x/crypto."
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
