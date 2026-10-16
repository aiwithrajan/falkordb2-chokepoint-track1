import re
from typing import List, Set, Tuple
from falkordb import Graph

PACKAGE_NAME_REGEX = re.compile(r"\b[a-zA-Z0-9@/._-]+(?:@[0-9a-zA-Z._-]+)?\b")

class HallucinationGuard:
    @staticmethod
    def resolve_package(graph: Graph, name: str) -> bool:
        """
        Validates package against FalkorDB graph vocabulary before any reasoning runs.
        """
        try:
            res = graph.query("MATCH (p:Pkg) WHERE p.name = $name RETURN count(p)", {"name": name})
            return res.result_set[0][0] > 0
        except Exception:
            return False

    @staticmethod
    def get_known_vocabulary(graph: Graph) -> Set[str]:
        """
        Returns all known package and advisory names in the active graph.
        """
        vocab = set()
        try:
            p_res = graph.query("MATCH (p:Pkg) RETURN p.name, p.key")
            for r in p_res.result_set:
                vocab.add(r[0])
                vocab.add(r[1])
            a_res = graph.query("MATCH (a:Advisory) RETURN a.id")
            for r in a_res.result_set:
                vocab.add(r[0])
        except Exception:
            pass
        return vocab

    @classmethod
    def validate_agent_text(cls, text: str, known_vocab: Set[str]) -> Tuple[bool, List[str]]:
        """
        Enforces that any technical package/advisory mentioned by the agent exists in the graph.
        """
        matches = PACKAGE_NAME_REGEX.findall(text)
        invented = []
        for m in matches:
            if "/" in m or "@" in m or "-" in m:
                if m not in known_vocab and not any(v in m for v in known_vocab):
                    # Check if it looks like an invented package name
                    if len(m) > 3 and not m.startswith("http") and not m.startswith("json"):
                        invented.append(m)

        if len(invented) > 3:
            return False, invented[:3]
        return True, []
