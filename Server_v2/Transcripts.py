import json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import WebshareProxyConfig
from dotenv import load_dotenv
import os
import requests

load_dotenv()

PROXY_ID = os.environ.get("PROXY_ID")
PROXY_PWD = os.environ.get("PROXY_PWD")

def test_proxy_connection():
    """Test if proxy is working correctly"""
    try:
        proxy_config = WebshareProxyConfig(
            proxy_username=PROXY_ID,
            proxy_password=PROXY_PWD,
        )
        
        # Test proxy by checking IP
        proxy_url = f"http://{PROXY_ID}:{PROXY_PWD}@proxy.webshare.io:80"
        proxies = {
            'http': proxy_url,
            'https': proxy_url
        }
        
        response = requests.get('https://httpbin.org/ip', proxies=proxies, timeout=10)
        print(f"Proxy IP: {response.json()}")
        return True
    except Exception as e:
        print(f"Proxy test failed: {str(e)}")
        return False

def fetch_youtube_transcript(videoId: str) -> str:
    try:
        # Debug: Check if proxy credentials exist
        if not PROXY_ID or not PROXY_PWD:
            return "ERROR: Proxy credentials not found in environment variables"
        
        print(f"Attempting to fetch transcript for video: {videoId}")
        print(f"Proxy ID exists: {bool(PROXY_ID)}")
        
        # Test proxy connection first
        if not test_proxy_connection():
            print("Warning: Proxy connection test failed")
        
        # Try with proxy first
        try:
            proxy_config = WebshareProxyConfig(
                proxy_username=PROXY_ID,
                proxy_password=PROXY_PWD,
            )
            
            Ytapi = YouTubeTranscriptApi(proxy_config=proxy_config)
            documents = Ytapi.get_transcript(videoId, languages=['en'])
            
            if documents:
                transcript_txt = ''.join([doc['text'] for doc in documents])
                print(f"Successfully fetched transcript with proxy (length: {len(transcript_txt)})")
                return transcript_txt
            else:
                return "No transcript available for this video."
                
        except Exception as proxy_error:
            print(f"Proxy attempt failed: {str(proxy_error)}")
            
            # Fallback: Try without proxy
            try:
                print("Attempting without proxy as fallback...")
                Ytapi_no_proxy = YouTubeTranscriptApi()
                documents = Ytapi_no_proxy.get_transcript(videoId, languages=['en'])
                
                if documents:
                    transcript_txt = ''.join([doc['text'] for doc in documents])
                    print(f"Successfully fetched transcript without proxy (length: {len(transcript_txt)})")
                    return transcript_txt
                else:
                    return "No transcript available for this video."
                    
            except Exception as no_proxy_error:
                print(f"No-proxy attempt failed: {str(no_proxy_error)}")
                return f"ERROR: Both proxy and direct attempts failed. Proxy error: {str(proxy_error)}, Direct error: {str(no_proxy_error)}"
     
    except Exception as e:
        error_msg = f"Error fetching transcript: {str(e)}"
        print(error_msg)
        return error_msg