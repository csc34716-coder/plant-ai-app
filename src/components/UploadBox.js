import { useState } from "react";

function UploadBox({ setResult }) {
  const [image, setImage] = useState(null);

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
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadBox;
