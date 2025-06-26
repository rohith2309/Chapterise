import json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import WebshareProxyConfig
from youtube_transcript_api.formatters import JSONFormatter
from dotenv import load_dotenv
import os
import logging
load_dotenv()
PROXY_ID=os.getenv('PROXY_ID')
PROXY_PWD=os.getenv('PROXY_PWD')
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
        documents= Ytapi.fetch(videoId)
        formatter = JSONFormatter()
          
    
        if documents:
         transcript_txt_formatted=formatter.format_transcript(documents)
         transcript_txt = json.dumps(json.loads(transcript_txt_formatted), indent=4, ensure_ascii=False)
         logging.info(f"Transcript fetched successfully for video ID: {videoId}")
         logging.debug(f"Transcript content: {transcript_txt}")    
         return transcript_txt
     
        else:
            return "No transcript available for this video."
    except Exception as e:
        return f"Error fetching transcript: {str(e)}"
    
    
