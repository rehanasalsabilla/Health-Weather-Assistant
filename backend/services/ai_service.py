from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_advice(city, weather, air):

    prompt = f"""
Kamu adalah AI Health Assistant profesional.

Jawab HANYA dalam JSON VALID.
Tanpa teks tambahan.
Tanpa markdown.

Data:
Kota: {city}
Suhu: {weather['temperature']} C
Kelembapan: {weather['humidity']} %
Kondisi: {weather['condition']}
AQI: {air['aqi']}

FORMAT:

{{
  "risk_level": "LOW / MEDIUM / HIGH",
  "risk_reason": "jelaskan penyebab utama",

  "comfort_level": "Comfortable / Uncomfortable",
  "comfort_reason": "jelaskan alasannya",

  "outdoor_activity": "rekomendasi aktivitas luar",
  "activity_reason": "jelaskan alasannya",

  "sensitive_warning": "peringatan kelompok sensitif",
  "warning_reason": "jelaskan alasannya",

  "confidence": "0-100",
  "smart_alert": "peringatan penting jika ada",

  "health_prediction": "prediksi kesehatan beberapa jam ke depan",

  "advice": "saran kesehatan singkat"
}}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content