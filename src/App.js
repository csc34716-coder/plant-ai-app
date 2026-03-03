import { useState } from "react"; // 1. इम्पोर्ट ज़रूर रखें

function App() { // 2. फंक्शन का नाम 'App' रखें
  const = useState(null);
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

      const data = await res.json();
      console.log(data);
      
      setResult(data.result || "Analysis complete (check console for data)"); 
    } catch (error) {
      console.error("Error:", error);
      setResult("Failed to get result from server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌱 Plant Disease Detector</h1>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>
      <h3>{result}</h3>
    </div>
  );
}

export default App; // 3. यह सबसे ज़रूरी लाइन है, इसे आखिर में ज़रूर लिखें [1.1, 1.2]
  
