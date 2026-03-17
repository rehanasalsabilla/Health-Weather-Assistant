import { useState } from "react"
import axios from "axios"

function App() {

  const [city, setCity] = useState("")
  const [data, setData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const checkWeather = async () => {

    setLoading(true)

    const res = await axios.post("http://127.0.0.1:8001/chat", {
      city: city
    })

    setData(res.data)

    const h = await axios.get("http://127.0.0.1:8001/history")
    setHistory(h.data)

    setLoading(false)
  }

  const riskColor = (risk)=>{
    if(!risk) return "#334155"
    if(risk.toLowerCase()==="high") return "#ef4444"
    if(risk.toLowerCase()==="medium") return "#f59e0b"
    return "#22c55e"
  }

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        <h1 style={styles.title}>Health Weather Assistant</h1>
        <p style={styles.subtitle}>
        Smart Weather Wellness Insight
        </p>

        <div style={styles.searchBox}>
          <input
            style={styles.input}
            placeholder="Masukkan kota..."
            value={city}
            onChange={(e)=>setCity(e.target.value)}
          />
          <button style={styles.button} onClick={checkWeather}>
            Cek
          </button>
        </div>

        {loading && (
          <div style={styles.loading}>
            🤖 AI sedang menganalisis cuaca...
          </div>
        )}

        {data && !loading && (
          <div style={styles.resultCard}>

            <h2 style={styles.sectionTitle}>Weather</h2>
            <p>
              {data.weather.temperature}°C · {data.weather.condition}
            </p>

            <h2 style={styles.sectionTitle}>Air Quality</h2>
            <p>AQI {data.air_quality.aqi}</p>

            <h2 style={styles.sectionTitle}>AI Insight</h2>
            <p>{data.advice}</p>

            <div style={styles.grid}>

              <div style={{
                ...styles.smallCard,
                borderLeft:`6px solid ${riskColor(data.risk_level)}`
              }}>
                <h3>Risk Level</h3>
                <div style={styles.value}>{data.risk_level}</div>
                <p style={styles.reason}>{data.risk_reason}</p>
              </div>

              <div style={styles.smallCard}>
                <h3>Comfort</h3>
                <b>{data.comfort_level}</b>
                <p style={styles.reason}>{data.comfort_reason}</p>
              </div>

              <div style={styles.smallCard}>
                <h3>Outdoor</h3>
                <b>{data.outdoor_activity}</b>
                <p style={styles.reason}>{data.activity_reason}</p>
              </div>

              <div style={styles.smallCard}>
                <h3>Warning</h3>
                <b>{data.sensitive_warning}</b>
                <p style={styles.reason}>{data.warning_reason}</p>
              </div>

            </div>

          </div>
        )}

        <h2 style={{marginTop:40}}>History</h2>

        <div style={styles.historyGrid}>

          {history.map((h,i)=>(
            <div key={i} style={styles.historyCard}>
              <h3>📍 {h.city}</h3>
              <p style={{fontSize:12,opacity:0.6}}>
                {new Date(h.time).toLocaleString()}
              </p>
              <p>{h.advice}</p>
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default App

const styles = {

  page:{
    minHeight:"100vh",
    padding:"60px 20px"
  },

  container:{
    maxWidth:1000,
    margin:"auto"
  },

  title:{
    textAlign:"center",
    fontSize:42,
    fontWeight:700,
    marginBottom:40,
    letterSpacing:-1
  },

  searchBox:{
    display:"flex",
    gap:12,
    justifyContent:"center",
    marginBottom:40
  },

  input:{
    padding:"14px 18px",
    borderRadius:14,
    border:"1px solid #e2e8f0",
    width:280,
    fontSize:15,
    outline:"none",
    background:"white",
    boxShadow:"0 2px 6px rgba(0,0,0,0.04)"
  },

  button:{
    padding:"14px 24px",
    borderRadius:14,
    border:"none",
    background:"#6366f1",
    color:"white",
    fontWeight:600,
    cursor:"pointer",
    boxShadow:"0 6px 16px rgba(99,102,241,0.25)"
  },

  resultCard:{
    background:"white",
    padding:30,
    borderRadius:24,
    boxShadow:"0 20px 40px rgba(0,0,0,0.08)",
    marginBottom:40
  },

  sectionTitle:{
    marginTop:20,
    marginBottom:8,
    fontSize:20,
    fontWeight:600
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:18,
    marginTop:25
  },

  smallCard:{
    background:"#f8fafc",
    padding:18,
    borderRadius:18,
    border:"1px solid #e5e7eb"
  },

  label:{
    fontSize:14,
    opacity:0.6,
    marginBottom:6
  },

  value:{
    fontSize:20,
    fontWeight:600
  },

  reason:{
    fontSize:13,
    marginTop:6,
    opacity:0.7,
    lineHeight:1.4
  },

  historyTitle:{
    fontSize:24,
    fontWeight:600,
    marginBottom:16
  },

  historyGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
    gap:16
  },

  historyCard:{
    background:"white",
    padding:16,
    borderRadius:16,
    border:"1px solid #e5e7eb",
    boxShadow:"0 10px 20px rgba(0,0,0,0.05)"
  },

  subtitle:{
  textAlign:"center",
  opacity:0.6,
  marginTop:-15,
  marginBottom:30,
  letterSpacing:1
}

}