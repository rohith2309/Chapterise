import json
from youtube_transcript_api import YouTubeTranscriptApi


def fetch_youtube_transcript(videoId: str) -> str:
    try:
        '''url=f'https://www.youtube.com/watch?v={videoId}'
        loader = YoutubeLoader.from_youtube_url(url, add_video_info=True)
        documents = loader.load()'''
        Ytapi=YouTubeTranscriptApi()
        documents= Ytapi.get_transcript(videoId, languages=['en'])  
    
        if documents:
         transcript_txt=''.join([doc['text'] for doc in documents])
           
         return transcript_txt
     
        else:
            return "No transcript available for this video."
    except Exception as e:
        return f"Error fetching transcript: {str(e)}"
    
    
