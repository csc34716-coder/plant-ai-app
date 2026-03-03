import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/ResultCard";

function Home() {
  const [result, setResult] = useState("");

  return (
    <div>
      <h1>🌱 Plant AI App</h1>
      <UploadBox setResult={setResult} />
      <ResultCard result={result} />
    </div>
  );
}

export default Home;
