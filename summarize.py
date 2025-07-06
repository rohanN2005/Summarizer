import os
import requests
from dotenv import load_dotenv
from google import genai
from youtube_transcript_api import YouTubeTranscriptApi
from bs4 import BeautifulSoup


load_dotenv()

#Function that summarizes youtube video given the video ID
def summarize(videoID):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

    #Retrieves transcript of youtube video which comes in list of segments
    #Trancript retrieved is in format [text, start, duration]
    youtube_api = YouTubeTranscriptApi()
    segments = youtube_api.get_transcript(videoID)

    #Joins the text from each segment of the transcript
    transcript = ''.join(segment['text'] for segment in segments)

    #Takes the transcript and uses it to prompt gemini API to get a summary
    prompt = "Take the follow transcript and summarize it\n" + transcript
    client = genai.Client(api_key = GEMINI_API_KEY)
    response = client.models.generate_content(model = "gemini-2.5-flash", contents = prompt)
    return response.text

def getTitle(link):
    r = requests.get(link)
    soup = BeautifulSoup(r.text)

    link = soup.find_all(name="title")[0]
    title = str(link)
    title = title.replace("<title>","")
    title = title.replace("</title>","")
    return title