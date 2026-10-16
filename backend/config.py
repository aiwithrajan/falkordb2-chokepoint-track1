import os

class Settings:
    FALKORDB_HOST: str = os.getenv("FALKORDB_HOST", "localhost")
    FALKORDB_PORT: int = int(os.getenv("FALKORDB_PORT", "6379"))
    FALKORDB_PASSWORD: str = os.getenv("FALKORDB_PASSWORD", "")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    MCP_PORT: int = int(os.getenv("MCP_PORT", "8002"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    VAULT_SEED_ON_BOOT: bool = os.getenv("VAULT_SEED_ON_BOOT", "true").lower() == "true"

settings = Settings()
