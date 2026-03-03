import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");

    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("https://plant-backend-v66z.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      console.log("Full Data:", responseData);

      if (responseData.success && responseData.data) {
        const info = responseData.data;

        setResult(
          `Status: ${info.status} | Disease: ${info.disease} | Treatment: ${info.treatment}`
        );
      } else {
        setResult("Error: " + (responseData.error || "No result"));
      }

    } catch (error) {
      console.error("Error:", error);
      setResult("Failed to get result from server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>🌱 Plant Disease Detector</h1>

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
