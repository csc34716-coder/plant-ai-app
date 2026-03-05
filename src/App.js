import { useState, useEffect } from "react";
import { db } from "./firebase"; 
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Upload, Loader2, Moon, Sun, Leaf, Image as ImageIcon, CheckCircle2, AlertCircle, History } from "lucide-react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "plantHistory"), orderBy("timestamp", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

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
  
      const res = await fetch("https://plant-backend-v66z.onrender.com", {      
        method: "POST",      
        body: formData,      
      });      
  
      const data = await res.json();      
      if (data.success) {      
        setResult(data.data);
        await addDoc(collection(db, "plantHistory"), {
          disease: data.data.disease || "Unknown",
          status: data.data.status || "Analyzed",
          treatment: data.data.treatment || "Check result",
          timestamp: serverTimestamp()
        });
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
    <div className={`${darkMode ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-900"} min-h-screen transition-colors duration-300 pb-10`}>
      <nav className="p-4 flex justify-between items-center max-w-2xl mx-auto border-b border-slate-200 dark:border-slate-800">      
        <div className="flex items-center gap-2 text-emerald-600 font-black">      
          <Leaf className="w-6 h-6" />      
          <span className="text-xl uppercase tracking-tighter">Plant.AI</span>      
        </div>      
        <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full ${darkMode ? "bg-slate-800 text-yellow-400" : "bg-white text-slate-600 shadow-sm border"}`}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>      
      </nav>      
  
      <main className="p-6 max-w-2xl mx-auto space-y-8">      
        <header className="text-center">      
          <h2 className="text-3xl font-black italic uppercase tracking-widest text-emerald-700 dark:text-emerald-500">Plant Health Scan</h2>      
        </header>      
  
        <div className={`${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} p-6 rounded-[2rem] border shadow-2xl backdrop-blur-md`}>      
          <div className="space-y-4">      
            {!preview ? (      
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-[1.5rem] p-10 cursor-pointer hover:border-emerald-500 transition-all bg-slate-50/50">      
                <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />      
                <span className="font-bold text-slate-500">Tap to select photo</span>      
                <input type="file" className="hidden" onChange={(e) => handleImage(e.target.files[0])} accept="image/*" />      
              </label>      
            ) : (      
              <div className="relative">      
                <img src={preview} alt="preview" className="w-full h-64 object-cover rounded-2xl shadow-lg" />      
                <button onClick={() => {setPreview(null); setImage(null);}} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md text-sm font-bold w-8 h-8 flex items-center justify-center">✕</button>      
              </div>      
            )}      
  
            <button disabled={!image || loading} onClick={handleUpload} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl disabled:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg">      
              {loading ? <Loader2 className="animate-spin" /> : <><Upload size={20} /> Start Analysis</>}      
            </button>      
          </div>      
        </div>      
  
        {result && (      
          <div className={`p-8 rounded-[2rem] border-2 shadow-xl animate-in zoom-in duration-300 ${result.error ? "bg-red-50 border-red-200 text-red-700" : "bg-white dark:bg-slate-900 border-emerald-500/20"}`}>      
            <div className="flex items-center gap-3 mb-4">      
              {result.error ? <AlertCircle /> : <CheckCircle2 className="text-emerald-500" size={24} />}      
              <h3 className="font-black text-xl uppercase tracking-widest text-slate-800 dark:text-slate-100">Result</h3>      
            </div>      
            <div className="space-y-4 text-sm font-medium">
              {result.error ? result.error : (
                <>
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Condition</p>
                      <p className="font-black text-xl capitalize text-emerald-600 tracking-tighter">{result.disease}</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Prescription</p>
                      <p className="opacity-80 leading-relaxed italic">"{result.treatment}"</p>
                   </div>
                </>
              )}      
            </div>      
          </div>      
        )}

        <div className="space-y-4 pt-4">
           <div className="flex items-center gap-2 px-2">
              <History className="text-emerald-500" size={20} />
              <h3 className="font-bold text-lg uppercase tracking-tight">Recent Scans</h3>
           </div>
           <div className="grid gap-3">
              {scans.length > 0 ? scans.map(scan => (
                <div key={scan.id} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center shadow-sm">
                   <div>
                      <p className="font-black text-sm uppercase text-slate-700 dark:text-slate-200 tracking-tighter">{scan.disease}</p>
                      <p className="text-[10px] opacity-40 font-bold tracking-widest">{scan.timestamp?.toDate() ? scan.timestamp.toDate().toLocaleDateString() : 'Saving...'}</p>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${scan.status === 'healthy' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {scan.status}
                   </div>
                </div>
              )) : (
                <p className="text-center py-10 opacity-30 text-xs italic font-black uppercase tracking-[0.2em]">No previous scans</p>
              )}
           </div>
        </div>
      </main>      
    </div>
  );
}

export default App;
