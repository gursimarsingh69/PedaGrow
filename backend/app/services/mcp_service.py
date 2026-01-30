from typing import List, Dict, Optional
from app.services.rag_service import get_rag_service


class MCPService:

    def build_prompt_with_context(
        self,
        query: str,
        context: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        prompt = ""

        if context:
            prompt += f"Context:\n{context}\n\n"

        if conversation_history:
            for msg in conversation_history[-5:]:
                prompt += f"{msg['role'].capitalize()}: {msg['content']}\n"

        prompt += f"User: {query}\nAssistant:"
        return prompt

    def format_context(self, query: str, docs):
        rag_service = get_rag_service()
        return rag_service.get_context_text(query)



_mcp_service: MCPService | None = None


def get_mcp_service() -> MCPService:
    global _mcp_service
    if _mcp_service is None:
        _mcp_service = MCPService()
    return _mcp_service