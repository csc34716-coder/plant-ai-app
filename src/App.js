import { useState } from "react";

function App() {
  const = useState(null); // यहाँ सुधार किया गया
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");
    
    setLoading(true);
    setResult(""); 

    try {
      const formData = new FormData();
      formData.append("image", image);

      // Render URL सही है
      const res = await fetch("https://plant-backend-v66z.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend Response:", data); // डेटा चेक करने के लिए
      
      // सुनिश्चित करें कि बैकएंड 'result' नाम की key भेज रहा है
      setResult(data.result || data.message || "Result key not found in response"); 
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
      
      {/* फाइल सिलेक्ट करने के लिए */}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      
      <br /><br />
      
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {/* रिजल्ट यहाँ दिखेगा */}
      <div style={{ marginTop: "20px", color: "green" }}>
        <h3>{result}</h3>
      </div>
    </div>
  );
}

export default App;
  
