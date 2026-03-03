const [image, setImage] = useState(null); // यहाँ 'image' और 'setImage' जोड़ें
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
    console.log("Backend Full Response:", responseData);
    
    // सुधार: बैकएंड 'data' की (key) में रिजल्ट भेज रहा है
    if (responseData.success && responseData.data) {
      const info = responseData.data;
      setResult(`Status: ${info.status} | Disease: ${info.disease} | Solution: ${info.treatment}`);
    } else {
      setResult("Analysis failed: " + (responseData.error || "Unknown error"));
    }
  } catch (error) {
    setResult("Server Error: " + error.message);
  } finally {
    setLoading(false);
  }
};
