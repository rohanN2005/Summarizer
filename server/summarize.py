import os
import requests
from dotenv import load_dotenv
from google import genai
from youtube_transcript_api import YouTubeTranscriptApi
from bs4 import BeautifulSoup

from google.cloud import speech
from google.cloud.speech import RecognitionConfig, RecognitionAudio
from mutagen.mp3 import MP3
from io import BytesIO

from google.api_core.client_options import ClientOptions

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
    prompt = "Take the following transcript and summarize it:\n\n" + transcript
    client = genai.Client(api_key = GEMINI_API_KEY)
    response = client.models.generate_content(model = "gemini-2.5-flash", contents = prompt)
    return response.text

def getTitle(link):
    r = requests.get(link)
    soup = BeautifulSoup(r.text,features="lxml")

    link = soup.find_all(name="title")[0]
    title = str(link)
    title = title.replace("<title>","")
    title = title.replace("</title>","")
    return title

def summarizeTranscript(transcript):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not defined")

    #Takes the transcript and uses it to prompt gemini API to get a summary
    prompt = "Take the following transcript and summarize it:\n\n" + transcript
    client = genai.Client(api_key = GEMINI_API_KEY)
    response = client.models.generate_content(model = "gemini-2.5-flash", contents = prompt)
    return response.text

def summarizeMP3(mp3_bytes, language_code):
    SPEECH_TEXT_API_KEY = os.getenv('GOOGLE_CLOUD_API_KEY')
    client_options = ClientOptions(api_key=SPEECH_TEXT_API_KEY)
    client = speech.SpeechClient(client_options=client_options)

    audio = RecognitionAudio(content=mp3_bytes)
    mutagen_audio = MP3(BytesIO(mp3_bytes))
    sample_rate = mutagen_audio.info.sample_rate
    config = RecognitionConfig(
        encoding=RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=sample_rate,   # change if your MP3 uses a different rate
        language_code=language_code,
        enable_automatic_punctuation=True
    )

    response = client.recognize(config=config, audio=audio)
    transcript_segments = [result.alternatives[0].transcript for result in response.results]
    transcript = " ".join(transcript_segments)
    return summarizeTranscript(transcript)

def uploadTitle(summary):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not defined")

    #Takes the transcript and uses it to prompt gemini API to get a summary
    prompt = "Take the following summary and generate a title for it:\n\n" + summary
    client = genai.Client(api_key = GEMINI_API_KEY)
    response = client.models.generate_content(model = "gemini-2.5-flash", contents = prompt)
    return response.text

