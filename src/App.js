import { useState } from "react";
import { Upload, Loader2, Moon, Sun, Leaf } from "lucide-react";
import { motion } from "framer-motion";

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
    } catch {
      setResult({ error: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all">

        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 shadow-md">
          <h1 className="text-xl font-bold">🌱 PlantCare AI</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </nav>

        {/* Hero */}
        <section className="text-center py-12 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Detect Plant Diseases Instantly
          </h1>
          <p className="opacity-80">
            Upload image and get AI-powered diagnosis
          </p>
        </section>

        {/* Upload Card */}
        <div className="flex justify-center px-4">
          <div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-lg bg-white/40 dark:bg-gray-900/40 shadow-xl border border-white/30">

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl p-6 cursor-pointer hover:bg-green-100 dark:hover:bg-gray-800 transition">
              <Upload size={35} />
              <p className="mt-2 text-sm">Click or drag image</p>

              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-4 rounded-xl w-full h-56 object-cover shadow-md"
              />
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white font-semibold flex justify-center items-center gap-2 hover:scale-105 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Plant"
              )}
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mt-8 p-6 rounded-2xl bg-white/40 dark:bg-gray-900/40 shadow-xl"
          >
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                  <Leaf /> Analysis Result
                </h2>

                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Disease:</strong> {result.disease}</p>

                <p className="mt-3 font-semibold">Treatment:</p>
                <p className="opacity-80">{result.treatment}</p>
              </>
            )}
          </motion.div>
        )}

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto py-12 px-4 grid md:grid-cols-3 gap-6">

          <div className="p-5 rounded-xl bg-white/40 dark:bg-gray-900/40 shadow hover:scale-105 transition">
            💧 <h3 className="font-bold">Water Properly</h3>
            <p className="text-sm">Avoid overwatering plants</p>
          </div>

          <div className="p-5 rounded-xl bg-white/40 dark:bg-gray-900/40 shadow hover:scale-105 transition">
            ☀️ <h3 className="font-bold">Sunlight</h3>
            <p className="text-sm">Give enough daily sunlight</p>
          </div>

          <div className="p-5 rounded-xl bg-white/40 dark:bg-gray-900/40 shadow hover:scale-105 transition">
            🌿 <h3 className="font-bold">Fertilizer</h3>
            <p className="text-sm">Use organic fertilizers</p>
          </div>

        </div>

        <footer className="text-center pb-6 opacity-70">
          © 2026 PlantCare AI
        </footer>

      </div>
    </div>
  );
}
function App() {
  return (
    <div>
      <h1 className="text-4xl text-green-600 font-bold">
        Tailwind Working 🚀
      </h1>
    </div>
  );
}

export default App;
export default App;

