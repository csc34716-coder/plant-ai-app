import { useState, useEffect } from "react";
import { db } from "./firebase";
import { initializeApp } from "firebase/app"; // Add storage imports to your firebase.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Upload, Loader2, Moon, Sun, Leaf, Image as ImageIcon, CheckCircle2, AlertCircle, History, MessageSquare } from "lucide-react";
import './index.css';

// Ensure your firebase.js exports 'storage' like this: export const storage = getStorage(app);
import { storage } from "./firebase";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState(""); // NEW: User Input State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "plantHistory"), orderBy("timestamp", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

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
      // 1. Upload to Firebase Storage first
      const storageRef = ref(storage, `plants/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const firebaseUrl = await getDownloadURL(storageRef);

      // 2. Send to Backend with the User Query
      const formData = new FormData();
      formData.append("image", image);
      formData.append("user_query", userQuery); // NEW: Send query to Python

      const res = await fetch("https://plant-backend-v66z.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        // 3. Save to Firestore with Image URL and User Note
        await addDoc(collection(db, "plantHistory"), {
          disease: data.data.disease || "Unknown",
          status: data.data.status || "Analyzed",
          treatment: data.data.treatment || "Check result",
          imageUrl: firebaseUrl, // SAVING IMAGE URL
          userNote: userQuery,   // SAVING USER QUERY
          timestamp: serverTimestamp()
        });
        setUserQuery(""); // Clear input after success
      } else {
        setResult({ error: data.error || "Analysis failed" });
      }
    } catch (err) {
      setResult({ error: "Upload failed. Check connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20 bg-gradient-to-b from-green-50 to-white dark:from-slate-900 dark:to-slate-950 ${darkMode ? 'text-white' : 'text-slate-900'}`}>

      <nav className="p-4 flex justify-between items-center max-w-2xl mx-auto border-b border-slate-200 dark:border-slate-800 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-emerald-600 font-black">
          <Leaf className="w-6 h-6" />
          <span className="text-xl uppercase tracking-tighter">Plant.AI</span>
        </div>
        <button onClick={() => setDarkMode((prev) => !prev)} className={`p-2 rounded-full ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-600 border'}`}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="p-6 max-w-2xl mx-auto space-y-8 mt-4">

        {/* Input Card */}
        <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} p-6 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl space-y-4`}>
          {!preview ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400/30 rounded-[1.5rem] p-10 cursor-pointer hover:bg-emerald-50/50 transition-all">
              <ImageIcon className="w-10 h-10 text-emerald-500 mb-2" />
              <span className="font-bold text-slate-400">Select Plant Photo</span>
              <input type="file" className="hidden" onChange={(e) => handleImage(e.target.files[0])} accept="image/*" />
            </label>
          ) : (
            <div className="relative">
              <img src={preview} alt="preview" className="w-full h-64 object-cover rounded-3xl shadow-lg" />
              <button onClick={() => {setPreview(null); setImage(null);}} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">✕</button>
            </div>
          )}

          {/* User Query Field */}
          <div className="relative">
            <MessageSquare className="absolute top-4 left-4 text-emerald-500 w-5 h-5" />
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask anything specific about this plant..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm h-24 resize-none"
            />
          </div>

          <button disabled={!image || loading} onClick={handleUpload} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
            {loading ? <Loader2 className="animate-spin" /> : <><Upload size={20} /> ANALYZE NOW</>}
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className={`p-8 rounded-[2.5rem] border-2 shadow-xl animate-in zoom-in duration-300 ${result.error ? "bg-red-50 border-red-200" : "bg-white dark:bg-slate-900 border-emerald-500/20"}`}>
            <div className="flex items-center gap-3 mb-4 text-emerald-600 font-black tracking-widest uppercase">
              <CheckCircle2 size={24} /> <h3>Analysis Result</h3>
            </div>
            <div className="space-y-4">
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Diagnosis</p>
                  <p className="font-black text-xl text-emerald-600">{result.disease}</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-l-4 border-emerald-500">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Treatment</p>
                  <p className="text-sm font-medium italic">"{result.treatment}"</p>
               </div>
            </div>
          </div>
        )}

        {/* Updated History with Image Thumbnails */}
        <div className="space-y-6 pt-6">
           <div className="flex items-center gap-3 px-2">
              <History className="text-emerald-500" size={24} />
              <h3 className="font-bold text-xl uppercase tracking-tight">Recent Scans</h3>
           </div>
           <div className="grid gap-4">
              {scans.map(scan => (
                <div key={scan.id} className="p-4 bg-white/60 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-4 shadow-sm backdrop-blur-md">
                   {/* IMAGE THUMBNAIL */}
                   <img src={scan.imageUrl} className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-slate-200" alt="plant" />
                   <div className="flex-1 min-w-0">
                      <p className="font-black text-sm uppercase text-slate-800 dark:text-slate-100 truncate">{scan.disease}</p>
                      <p className="text-[10px] opacity-40 font-bold tracking-widest">{scan.timestamp?.toDate().toLocaleDateString()}</p>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${scan.status === 'healthy' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {scan.status}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;
