import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Select image first");

    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("https://plant-backend-v66z.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.data) {
        const info = data.data;

        setResult(
          `🌿 Status: ${info.status}\n🦠 Disease: ${info.disease}\n💊 Treatment: ${info.treatment}`
        );
      } else {
        setResult("❌ " + (data.error || "No result"));
      }
    } catch {
      setResult("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      <h1 style={styles.logo}>🌱 PlantCare AI</h1>

      <div style={styles.card}>
        <p style={styles.subtitle}>Upload plant image to detect disease</p>

        <input type="file" onChange={handleImage} style={styles.input} />

        {preview && (
          <img src={preview} alt="preview" style={styles.image} />
        )}

        <button onClick={handleUpload} style={styles.button}>
          {loading ? "Analyzing..." : "Analyze Plant"}
        </button>
      </div>

      {result && (
        <div style={styles.resultBox}>
          <h3>🌿 Analysis Result</h3>
          <pre style={styles.resultText}>{result}</pre>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #d4fc79, #96e6a1)",
    textAlign: "center",
    padding: "20px",
    fontFamily: "Segoe UI",
  },

  logo: {
    color: "#1b5e20",
    marginBottom: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "15px",
    maxWidth: "350px",
    margin: "auto",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "10px",
  },

  input: {
    marginBottom: "10px",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "10px",
  },

  button: {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  resultBox: {
    marginTop: "20px",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "350px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },

  resultText: {
    whiteSpace: "pre-wrap",
    textAlign: "left",
  },
};

export default App;
