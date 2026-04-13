from celery import Celery
from twilio.rest import Client
from .app.core.config import settings

celery_app = Celery("poultryguard_worker", broker=settings.REDIS_URL)

@celery_app.task
def send_vaccination_reminder(phone_number: str, vaccine_name: str, due_date: str):
    if not settings.TWILIO_ACCOUNT_SID:
        print(f"Reminder for {vaccine_name} on {due_date} to {phone_number} (Twilio not configured)")
        return
    
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body=f"Reminder: Your flock is due for {vaccine_name} on {due_date}. - PoultryGuard AI",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone_number
    )
    return message.sid
