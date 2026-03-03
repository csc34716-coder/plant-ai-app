import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("https://plant-backend-v66z.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌱 Plant Disease Detector</h1>

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <br /><br />

      <button onClick={handleUpload}>Upload</button>

      <h3>{result}</h3>
    </div>
  );
}

export default App;