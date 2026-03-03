const [loading, setLoading] = useState(false); // नई स्टेट

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
    
    // अगर बैकएंड से 'result' नहीं बल्कि कुछ और आ रहा है तो उसे यहाँ बदलें
    setResult(data.result || "Analysis complete (check console for data)"); 
  } catch (error) {
    console.error("Error:", error);
    setResult("Failed to get result from server.");
  } finally {
    setLoading(false);
  }
};

// UI में बटन को ऐसे बदलें:
<button onClick={handleUpload} disabled={loading}>
  {loading ? "Processing..." : "Upload & Analyze"}
</button>
