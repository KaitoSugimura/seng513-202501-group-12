import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { databases, storage, dbId, User } from '../util/appwrite';
import styles from "../components/ProfileImageUpload.module.css";
import ImageUpload from '../components/ImageUpload'
import { ID } from 'appwrite'

export default function QuizListViewer() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [inputImage, setInputImage] = useState<File | null>(null);

  const handleUpdate = async () => {
    console.log(user)
    if (inputImage && user) {
      const inputImageFile = await storage.createFile(
        "images",
        ID.unique(),
        inputImage
      );
      
      if(user.profilePictureId) {
        await storage.deleteFile("images", user.profilePictureId)
      }
      await databases.updateDocument(dbId, "users", user.$id, { profilePictureId: inputImageFile.$id })
      
      setIsVisible(false);
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2 className={styles.popupTitle}>Update Profile Picture</h2>
          <ImageUpload
            file={inputImage}
            setFile={setInputImage}
            text={"Upload or drag and drop profile image"}
          />
        <div className={styles.popupActions}>
          <button className={styles.confirmButton} onClick={handleUpdate}>
            Apply
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

