import requests
import os

API_KEY = os.getenv("WEATHER_API_KEY")

def get_air_quality(lat, lon):

    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"

    res = requests.get(url)
    data = res.json()

    aqi = data["list"][0]["main"]["aqi"]

    return {
        "aqi": aqi
    }