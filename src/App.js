import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  limit
} from "firebase/firestore";

import {
  Upload,
  Loader2,
  Moon,
  Sun,
  Leaf,
  Image as ImageIcon,
  CheckCircle2,
  History,
  MessageSquare
} from "lucide-react";

import "./index.css";

function App() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  const [scans, setScans] = useState([]);

  // Load history
  useEffect(() => {
    const q = query(
      collection(db, "plantHistory"),
      orderBy("timestamp", "desc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScans(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
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

      const formData = new FormData();
      formData.append("image", image);
      formData.append("user_query", userQuery);

      const res = await fetch(
        "https://plant-backend-v66z.onrender.com/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (data.success) {

        setResult(data.data);

        // Save to Firestore
        await addDoc(collection(db, "plantHistory"), {
          disease: data.data.disease || "Unknown",
          status: data.data.status || "Analyzed",
          treatment: data.data.treatment || "Check result",
          imageUrl: data.image_url, // Cloudinary image URL
          userNote: userQuery,
          timestamp: serverTimestamp()
        });

        setUserQuery("");

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
    <div
      className={`min-h-screen transition-colors duration-500 pb-20 
      bg-gradient-to-b from-green-50 to-white 
      dark:from-slate-900 dark:to-slate-950 
      ${darkMode ? "text-white" : "text-slate-900"}`}
    >

      {/* Navbar */}

      <nav className="p-4 flex justify-between items-center max-w-2xl mx-auto border-b border-slate-200 dark:border-slate-800 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">

        <div className="flex items-center gap-2 text-emerald-600 font-black">
          <Leaf className="w-6 h-6" />
          <span className="text-xl uppercase tracking-tighter">
            Plant.AI
          </span>
        </div>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className={`p-2 rounded-full ${
            darkMode
              ? "bg-slate-800 text-yellow-400"
              : "bg-white text-slate-600 border"
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      </nav>

      {/* Main */}

      <main className="p-6 max-w-2xl mx-auto space-y-8 mt-4">

        {/* Upload Card */}

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl space-y-4">

          {!preview ? (

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400/30 rounded-[1.5rem] p-10 cursor-pointer hover:bg-emerald-50/50 transition-all">

              <ImageIcon className="w-10 h-10 text-emerald-500 mb-2" />

              <span className="font-bold text-slate-400">
                Select Plant Photo
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImage(e.target.files[0])}
                accept="image/*"
              />

            </label>

          ) : (

            <div className="relative">

              <img
                src={preview}
                alt="preview"
                className="w-full h-64 object-cover rounded-3xl shadow-lg"
              />

              <button
                onClick={() => {
                  setPreview(null);
                  setImage(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              >
                ✕
              </button>

            </div>
          )}

          {/* User Query */}

          <div className="relative">

            <MessageSquare className="absolute top-4 left-4 text-emerald-500 w-5 h-5" />

            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask anything about this plant..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm h-24 resize-none"
            />

          </div>

          <button
            disabled={!image || loading}
            onClick={handleUpload}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >

            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Upload size={20} /> ANALYZE NOW
              </>
            )}

          </button>

        </div>

        {/* Result */}

        {result && (

          <div className="p-8 rounded-[2.5rem] border-2 shadow-xl bg-white dark:bg-slate-900 border-emerald-500/20">

            <div className="flex items-center gap-3 mb-4 text-emerald-600 font-black uppercase">
              <CheckCircle2 size={24} />
              <h3>Analysis Result</h3>
            </div>

            <div className="space-y-4">

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                <p className="text-xs text-slate-400">Diagnosis</p>
                <p className="font-black text-xl text-emerald-600">
                  {result.disease}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-l-4 border-emerald-500">
                <p className="text-xs text-slate-400">Treatment</p>
                <p className="text-sm italic">{result.treatment}</p>
              </div>

            </div>

          </div>

        )}

        {/* History */}

        <div className="space-y-6 pt-6">

          <div className="flex items-center gap-3 px-2">
            <History className="text-emerald-500" size={24} />
            <h3 className="font-bold text-xl uppercase">
              Recent Scans
            </h3>
          </div>

          <div className="grid gap-4">

            {scans.map((scan) => (

              <div
                key={scan.id}
                className="p-4 bg-white/60 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-4 shadow-sm"
              >

                <img
                  src={scan.imageUrl}
                  className="w-14 h-14 rounded-2xl object-cover"
                  alt="plant"
                />

                <div className="flex-1">

                  <p className="font-black text-sm uppercase">
                    {scan.disease}
                  </p>

                  <p className="text-xs opacity-40">
                    {scan.timestamp?.toDate().toLocaleDateString()}
                  </p>

                </div>

                <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
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
