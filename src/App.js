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
    setResult(null); 
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
      // Changed this line to be more flexible with your backend response
      if (data.success) {      
        setResult(data.data);      
      } else {      
        setResult({ error: data.error || "Analysis failed" });      
      }      
    } catch (err) {      
      setResult({ error: "Server connection failed. Check your Backend." });      
    } finally {      
      setLoading(false);      
    }
  };

  return (
    <div className={`${darkMode ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-900"} min-h-screen transition-colors duration-300`}>
      <nav className="p-4 flex justify-between items-center max-w-2xl mx-auto">      
        <div className="flex items-center gap-2 text-emerald-600">      
          <Leaf className="w-6 h-6" />      
          <span className="font-bold text-xl">PlantAI</span>      
        </div>      
        <button      
          onClick={() => setDarkMode(!darkMode)}      
          className={`p-2 rounded-full ${darkMode ? "bg-slate-800 text-yellow-400" : "bg-white text-slate-600 shadow-sm border"}`}      
        >      
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}      
        </button>      
      </nav>      
  
      <main className="p-6 max-w-2xl mx-auto space-y-6">      
        <header className="text-center">      
          <h2 className="text-3xl font-extrabold">Plant Diagnosis</h2>      
          <p className="opacity-60">Instant health check for your plants</p>      
        </header>      
  
        <div className={`${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} p-6 rounded-3xl border shadow-xl`}>      
          <div className="space-y-4">      
            {!preview ? (      
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-10 cursor-pointer hover:border-emerald-500 transition-all bg-slate-50/50">      
                <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />      
                <span className="font-medium text-slate-500">Select plant photo</span>      
                <input type="file" className="hidden" onChange={(e) => handleImage(e.target.files[0])} accept="image/*" />      
              </label>      
            ) : (      
              <div className="relative">      
                <img src={preview} alt="preview" className="w-full h-64 object-cover rounded-2xl" />      
                <button       
                  onClick={() => {setPreview(null); setImage(null);}}      
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"      
                >      
                  <AlertCircle size={16} />      
                </button>      
              </div>      
            )}      
  
            <button      
              disabled={!image || loading}      
              onClick={handleUpload}      
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"      
            >      
              {loading ? <Loader2 className="animate-spin" /> : <><Upload size={20} /> Analyze Now</>}      
            </button>      
          </div>      
        </div>      
  
        {result && (      
          <div className={`p-6 rounded-3xl border ${result.error ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}>      
            <div className="flex items-center gap-2 mb-2">      
              {result.error ? <AlertCircle /> : <CheckCircle2 />}      
              <h3 className="font-bold">Result</h3>      
            </div>      
            <div className="bg-white/50 p-4 rounded-xl text-sm font-medium">      
              {result.error ? result.error : (
                <div className="space-y-2">
                   <p><strong>Status:</strong> {result.status || "N/A"}</p>
                   <p><strong>Disease:</strong> {result.disease || "N/A"}</p>
                   <p><strong>Treatment:</strong> {result.treatment || "Check log for details"}</p>
                </div>
              )}      
            </div>      
          </div>      
        )}      
      </main>      
    </div>
  );
}

export default App;
            
