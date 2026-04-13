from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.models import ChatSession, ChatMessage
from ...schemas.schemas import ChatMessageRequest, ChatMessageResponse
from ...services.ai_chat import chat_service

router = APIRouter()

@router.post("/vet-assistant", response_model=ChatMessageResponse)
def vet_chat(
    req: ChatMessageRequest,
    db: Session = Depends(get_db)
):
    # Ensure session exists
    session = db.query(ChatSession).filter(ChatSession.session_id == req.session_id).first()
    if not session:
        # In a real app, you'd get user_id from token
        # For now, create a mock session if not exists
        session = ChatSession(session_id=req.session_id, user_id=1) 
        db.add(session)
        db.commit()

    # Save user message
    user_msg = ChatMessage(session_id=req.session_id, role="user", content=req.content)
    db.add(user_msg)

    # RAG Response
    ai_response_content = chat_service.get_response(req.content)

    # Save assistant message
    ai_msg = ChatMessage(session_id=req.session_id, role="assistant", content=ai_response_content)
    db.add(ai_msg)
    db.commit()

    return {
        "content": ai_response_content,
        "reasoning": "Based on retrieved poultry husbandry protocols.",
        "recommended_action": "Follow the prescribed treatment and monitor the flock."
    }
