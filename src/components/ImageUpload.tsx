import { useState, useEffect } from "react";
import styles from "./ImageUpload.module.css";
import { Plus, Trash2 } from "lucide-react";

interface ImageUploadProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  text: string;
}

export default function ImageUpload({ file, setFile, text }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  return (
    <div className={styles.container}>
      {!file ? (
        <div
          className={styles.uploadBox}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 -960 960 960"
            width="48px"
            fill="#FFFFFF"
          >
            <path d="M480-313 287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193ZM220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Z" />
          </svg>
          <p>{text}</p>
        </div>
      ) : preview ? (
        <div className={styles.imageBox}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
          <span onClick={handleRemoveImage} className={styles.removeButton}>
            <Trash2 />
          </span>
        </div>
      ) : (
        <p>Loading preview...</p>
      )}
    </div>
  );
}
