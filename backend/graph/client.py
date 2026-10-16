import logging
from typing import List, Optional
import falkordb
from falkordb import Graph
from backend.config import settings

logger = logging.getLogger("chokepoint.falkor")

class FalkorManager:
    _instance: Optional["FalkorManager"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FalkorManager, cls).__new__(cls)
            cls._instance._init_connection()
        return cls._instance

    def _init_connection(self):
        self.host = settings.FALKORDB_HOST
        self.port = settings.FALKORDB_PORT
        self.password = settings.FALKORDB_PASSWORD or None
        logger.info(f"Connecting to FalkorDB at {self.host}:{self.port}...")
        self.client = falkordb.FalkorDB(
            host=self.host,
            port=self.port,
            password=self.password
        )

    def select_graph(self, graph_name: str) -> Graph:
        return self.client.select_graph(graph_name)

    def list_graphs(self) -> List[str]:
        try:
            return self.client.list_graphs()
        except Exception as e:
            logger.error(f"Error listing graphs: {e}")
            return []

    def copy_graph(self, src: str, dst: str) -> bool:
        """
        Executes native FalkorDB GRAPH.COPY command for sub-3ms multigraph cloning.
        """
        try:
            self.client.connection.execute_command("GRAPH.COPY", src, dst)
            return True
        except Exception as e:
            logger.error(f"GRAPH.COPY failed from {src} to {dst}: {e}")
            return False

    def delete_graph(self, graph_name: str) -> bool:
        try:
            self.client.connection.execute_command("GRAPH.DELETE", graph_name)
            return True
        except Exception as e:
            # If not exists, ignore
            return False

    def ping(self) -> bool:
        try:
            self.client.connection.ping()
            return True
        except Exception:
            return False
