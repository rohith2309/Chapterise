import json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import WebshareProxyConfig
from dotenv import load_dotenv
import os
load_dotenv()

PROXY_ID = os.environ.get("PROXY_ID")
PROXY_PWD = os.environ.get("PROXY_PWD")

def fetch_youtube_transcript(videoId: str) -> str:
    try:
        '''url=f'https://www.youtube.com/watch?v={videoId}'
        loader = YoutubeLoader.from_youtube_url(url, add_video_info=True)
        documents = loader.load()'''
        Ytapi=YouTubeTranscriptApi(
            proxy_config=WebshareProxyConfig(
        proxy_username=PROXY_ID,
        proxy_password=PROXY_PWD,
        )
        )
        documents= Ytapi.get_transcript(videoId, languages=['en'])  
    
        if documents:
         transcript_txt=''.join([doc['text'] for doc in documents])
           
         return transcript_txt
     
        else:
            return "No transcript available for this video."
    except Exception as e:
        return f"Error fetching transcript: {str(e)}"
    
    
