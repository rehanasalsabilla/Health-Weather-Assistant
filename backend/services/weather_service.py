import requests
from config import WEATHER_API_KEY

def get_weather(city: str):

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"

    response = requests.get(url)
    data = response.json()

    print(data)   # ⭐ untuk debug

    # ⭐ HANDLE ERROR API
    if response.status_code != 200:
        raise Exception(f"Weather API error: {data}")

    return {
    "temperature": data["main"]["temp"],
    "humidity": data["main"]["humidity"],
    "condition": data["weather"][0]["description"],
    "lat": data["coord"]["lat"],
    "lon": data["coord"]["lon"]
}