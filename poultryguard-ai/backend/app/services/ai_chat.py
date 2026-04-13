from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from ..core.config import settings
import os

class VetChatService:
    def __init__(self):
        self.embeddings = None
        self.vector_store = None
        self.qa_chain = None
        self.llm = None
        self.initialized = False

    def initialize(self):
        if self.initialized:
            return
        
        if not settings.GEMINI_API_KEY:
             raise ValueError("Gemini API Key is missing. Please set GEMINI_API_KEY in .env file.")

        # Using Gemini Embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=settings.GEMINI_API_KEY
        )
        
        # Load or create vector store
        store_path = "faiss_index_gemini"
        if os.path.exists(store_path):
            self.vector_store = FAISS.load_local(
                store_path, 
                self.embeddings, 
                allow_dangerous_deserialization=True
            )
        else:
            # Knowledge base for poultry
            texts = [
                "Newcastle Disease (ND) is highly contagious. Symptoms: twisting neck, paralysis, green diarrhea. Quarantine immediately.",
                "Coccidiosis is caused by protozoa in litter. Symptoms: bloody droppings, ruffled feathers. Treatment: Amprolium.",
                "Fowl Pox symptoms: scab-like lesions on comb/wattles. Prevention: Mosquito control and vaccination.",
                "Salmonella (Pullorum) causes white diarrhea in chicks. Strict biosecurity is vital.",
                "Healthy poultry requires clean water, ventilation, and a balanced diet of proteins and minerals."
            ]
            self.vector_store = FAISS.from_texts(texts, self.embeddings)
            self.vector_store.save_local(store_path)
            
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-flash-latest",
            temperature=0.2,
            google_api_key=settings.GEMINI_API_KEY
        )
        
        template = """You are an expert poultry veterinarian. Use the following context to provide diagnosis reasoning, 
        treatment protocols, drug dosages, and flag if a physical vet referral is necessary.
        
        Context: {context}
        Question: {question}
        
        Answer professionally and clearly:"""
        
        QA_PROMPT = PromptTemplate(template=template, input_variables=["context", "question"])
        
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(),
            chain_type_kwargs={"prompt": QA_PROMPT}
        )
        self.initialized = True

    def get_response(self, message: str):
        try:
            self.initialize()
            response = self.qa_chain.invoke({"query": message})
            return response["result"]
        except Exception as e:
            return f"Chat Error: {str(e)}"

chat_service = VetChatService()
