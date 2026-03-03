import { useState } from "react";

function App() {
  const [image, setImage] = useState(null); 
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("https://plant-backend-v66z.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      // ✅ important check
      if (!res.ok) {
        throw new Error("Server error");
      }

      const responseData = await res.json();
      console.log("Full Data:", responseData);

      // ✅ clean handling
      if (responseData.result) {
        setResult(responseData.result);
      } else if (responseData.error) {
        setResult("Error: " + responseData.error);
      } else {
        setResult("No result returned");
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
      
      <input 
        type="file" 
        onChange={(e) => setImage(e.target.files[0])} 
      />
      
      <br /><br />
      
      <button 
        onClick={handleUpload} 
        disabled={loading} 
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ddd" }}>
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
