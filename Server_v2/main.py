from fastapi import FastAPI,WebSocket, HTTPException,WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from typing import Optional, List
import json
import os
from html import unescape
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

from Transcripts import fetch_youtube_transcript
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
app= FastAPI(
    title="BACKEND for AI ChatBot and Youtube Chapter Extraction",
    description="A simple FastAPI backend for AI ChatBot and Youtube chapter extraction.",
    version="1.0.0",
) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chapterise.vercel.app",
        "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", 
    google_api_key=GOOGLE_API_KEY,
    temperature=0,
    max_tokens=None,  
    timeout=None,
    max_retries=2,
)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that answers questions based on a YouTube video transcript. Provide clear, concise, and accurate answers based only on the information provided in the transcript."),
    ("human", "Here is the transcript: {transcript}\n\nUser's question: {question}\n\nPlease provide a detailed answer based on the transcript content.")
])

# Create the chain using LCEL (LangChain Expression Language)
output_parser = StrOutputParser()
chat_chain = prompt_template | llm | output_parser

class VideoRequest(BaseModel):
    videoId: str


class Chapter(BaseModel):
    timestamp: str
    title: str
    completed: bool = False


class ChapterResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    chapters: Optional[List[Chapter]] = None

class ChatResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    response: Optional[str] = None

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/chapters", response_model=ChapterResponse)
async def get_chapters(video: VideoRequest):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(
            f'https://www.youtube.com/watch?v={video.videoId}', 
            headers=headers
        )
        response.raise_for_status()

        if 'ytInitialData = ' not in response.text:
            return ChapterResponse(success=False, message="No chapters data found")

        json_str = response.text.split('ytInitialData = ')[1].split(';</script')[0]
        data = json.loads(unescape(json_str))

        # Extract chapters from engagement panels
        for panel in data.get('engagementPanels', []):
            contents = (
                panel.get('engagementPanelSectionListRenderer', {})
                .get('content', {})
                .get('macroMarkersListRenderer', {})
                .get('contents', [])
            )

            if contents:
                chapters = []
                for item in contents:
                    marker = item.get('macroMarkersListItemRenderer')
                    if marker:
                        chapters.append(
                            Chapter(
                                timestamp=marker.get('timeDescription', {}).get('simpleText', ''),
                                title=marker.get('title', {}).get('simpleText', 'Untitled'),
                                completed=False
                            )
                        )
                
                if chapters:
                    return ChapterResponse(success=True, chapters=chapters)

        return ChapterResponse(success=False, message="No chapters found in video")

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching video: {str(e)}")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")



    try:
        # fetch transcript of youtube video
        transcript=fetch_youtube_transcript(videoId.videoId)
        
        ai_response = f"AI response to:  based on video {videoId.videoId} with transcript: {transcript}"
        print(ai_response)

        return ChatResponse(success=True, response=ai_response,message=videoId.videoId)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")    
@app.websocket("/ws/chat/{videoId}")
async def websocket_chat(websocket: WebSocket, videoId: str):
    await websocket.accept()
    
    try:
        # Fetch transcript once at the beginning
        transcript = fetch_youtube_transcript(videoId)
        
        if "ERROR" in transcript or "No transcript available" in transcript or not transcript:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Unable to fetch transcript for this video. Please ensure the video has captions available."
            }))
            await websocket.close()
            return
        
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "system",
            "message": f"Hi I'm FABI your learning assistant. You can now ask questions about the video content,Happy learning!. Type 'exit' to end the session."
        }))
        
        while True:
            try:
                user_message = await websocket.receive_text()
                
                if user_message.lower().strip() == "exit":
                    await websocket.send_text(json.dumps({
                        "type": "system",
                        "message": "Chat session ended. Goodbye!"
                    }))
                    break
                
                
                ai_response = await chat_chain.ainvoke({
                    "transcript": transcript,
                    "question": user_message
                })
                
                # Send the AI response back to the client
                await websocket.send_text(json.dumps({
                    "type": "ai_response",
                    "message": ai_response,
                    "question": user_message
                }))
                
            except WebSocketDisconnect:
                print(f"WebSocket connection closed by client for video ID: {videoId}")
                break
            except Exception as e:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": f"Error processing your message: {str(e)}"
                }))
                print(f"Error processing message for video ID {videoId}: {str(e)}")
                
    except Exception as e:
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": f"Connection error: {str(e)}"
        }))
        print(f"WebSocket connection error for video ID {videoId}: {str(e)}")
    finally:
        print(f"WebSocket connection terminated for video ID: {videoId}")
                            
            
            
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=5000)