import { useState } from "react";
import { Upload, Loader2, Moon, Sun, Leaf } from "lucide-react";


function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleImage = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Select image first");

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("https://plant-backend-v66z.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setResult({ error: data.error || "No result" });
      }
    } catch (err) {
      setResult({ error: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark bg-black text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <div className="p-5 text-center">
        <h1 className="text-3xl font-bold flex justify-center gap-2">
          <Leaf /> Plant AI App
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-3 px-4 py-2 border rounded"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>

        <div className="mt-5">
          <input
            type="file"
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </div>

        {preview && (
          <img src={preview} alt="preview" className="mt-4 w-60 mx-auto rounded" />
        )}

        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Upload />}
        </button>

        {result && (
          <div className="mt-5">
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <p className="text-green-600">Result: {JSON.stringify(result)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
