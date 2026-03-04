import { useState } from "react";
import { Upload, Loader2, Moon, Sun, Leaf, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null); // Clear previous result on new selection
  };

  const handleUpload = async () => {
    if (!image) return;

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
        setResult({ error: data.error || "Could not identify plant" });
      }
    } catch (err) {
      setResult({ error: "Server connection failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-900"} min-h-screen transition-colors duration-300`}>
      
      {/* Navbar */}
      <nav className="p-4 flex justify-between items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Leaf className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">PlantAI</span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? "bg-slate-800 text-yellow-400" : "bg-white text-slate-600 shadow-sm border"}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        
        {/* Hero Section */}
        <header className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold">Plant Diagnosis</h2>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>Upload a photo to detect diseases instantly.</p>
        </header>

        {/* Upload Card */}
        <div className={`${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} p-6 rounded-3xl border shadow-xl shadow-emerald-500/5`}>
          <div className="space-y-4">
            {!preview ? (
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${darkMode ? "border-slate-700 hover:border-emerald-500 bg-slate-800/50" : "border-slate-200 hover:border-emerald-500 bg-slate-50"}`}>
                <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
                <span className="font-medium text-slate-500">Tap to select photo</span>
                <input type="file" className="hidden" onChange={(e) => handleImage(e.target.files[0])} accept="image/*" />
              </label>
            ) : (
              <div className="relative group">
                <img src={preview} alt="preview" className="w-full h-64 object-cover rounded-2xl shadow-inner" />
                <button 
                  onClick={() => {setPreview(null); setImage(null);}}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <AlertCircle size={16} />
                </button>
              </div>
            )}

            <button
              disabled={!image || loading}
              onClick={handleUpload}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                !image || loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 active:scale-95"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Upload size={20} /> Analyze Now</>}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 rounded-3xl border ${
            result.error 
            ? "bg-red-50 border-red-100 text-red-700" 
            : "bg-emerald-50 border-emerald-100 text-emerald-800"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {result.error ? <AlertCircle /> : <CheckCircle2 className="text-emerald-600" />}
              <h3 className="font-bold text-lg">Analysis Complete</h3>
            </div>
            <div className="text-sm font-medium opacity-90 leading-relaxed bg-white/50 p-4 rounded-xl border border-white">
              {result.error ? result.error : (
                <pre className="whitespace-pre-wrap font-sans">
                  {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
                </pre>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-xs opacity-50 font-medium">
        Powered by Vercel & Render
      </footer>
    </div>
  );
}

export default App;
              
