import { useState } from "react";

function App() {
  // 1. स्टेट्स को सही करें
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

      const res = await fetch("https://plant-backend-v66z.onrender.com", {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      console.log("Full Data:", responseData);
      
      // 2. बैकएंड के डेटा स्ट्रक्चर के हिसाब से रिजल्ट सेट करें
      if (responseData.success && responseData.data) {
        const info = responseData.data;
        setResult(`Status: ${info.status} | Disease: ${info.disease} | Solution: ${info.treatment}`);
      } else {
        setResult("Error: " + (responseData.error || "Could not analyze image"));
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
      
      <button onClick={handleUpload} disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ddd", display: result ? "block" : "none" }}>
        <h3>Result:</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}

// 3. यह लाइन सबसे नीचे ज़रूर होनी चाहिए!
export default App; 
  
