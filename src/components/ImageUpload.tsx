import { useState } from "react";
import styles from "./ImageUpload.module.css";
import { Plus, Trash2 } from "lucide-react";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
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
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className={styles.container}>
      {!preview ? (
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
          <p>Upload or drag and drop media</p>
          <button className={styles.uploadButton}>
            <Plus></Plus>
          </button>
        </div>
      ) : (
        <div className={styles.uploadBox}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
          <span onClick={handleRemoveImage} className={styles.removeButton}>
            <Trash2 />
          </span>
        </div>
      )}
    </div>
  );
}
