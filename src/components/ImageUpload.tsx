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
          <p>{text}</p>
          <button className={styles.uploadButton}>
            <Plus />
          </button>
        </div>
      ) : preview ? (
        <div className={styles.uploadBox}>
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
