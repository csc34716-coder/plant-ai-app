import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // preview image
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");

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

    } catch (err) {
      setResult("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      <h1 style={styles.title}>🌱 Plant AI</h1>

      {/* Upload Card */}
      <div style={styles.card}>
        
        <input type="file" onChange={handleImageChange} />

        {preview && (
          <img src={preview} alt="preview" style={styles.image} />
        )}

        <button onClick={handleUpload} style={styles.button}>
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div style={styles.resultCard}>
          <h3>Result</h3>
          <pre style={styles.resultText}>{result}</pre>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial",
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  title: {
    color: "#2e7d32",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "350px",
    margin: "auto",
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  image: {
    marginTop: "10px",
    width: "100%",
    borderRadius: "10px",
  },
  resultCard: {
    marginTop: "20px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "350px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  resultText: {
    whiteSpace: "pre-wrap",
    textAlign: "left",
  },
};

export default App;
