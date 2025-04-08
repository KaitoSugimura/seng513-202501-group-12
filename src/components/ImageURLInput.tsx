import { useState } from 'react';
import { databases, dbId } from '../util/appwrite';
import styles from "../components/ImageURLInput.module.css";

export default function QuizListViewer(userId : string) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isValidUrl = (ullString: string) => {
    try {
      new URL(ullString);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdate = async () => {
    if (!url || !isValidUrl(url)) {
      console.error('Invalid URL');
      return;
    }

    setLoading(true);
    try {
      console.log(userId)
      console.log(url)
      await databases.updateDocument(dbId, 'users', userId, {profilePicture: url});
    } catch (error) {
      console.error('Failed to update profile picture.');
    } finally {
      setLoading(false);
      setIsVisible(false);
    }
  };

  const handleCancel = () => {
    setUrl('');
    setIsVisible(false);
  };


  if (!isVisible) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2 className={styles.popupTitle}>Update Profile Picture</h2>
        <input
          type="text"
          placeholder="Enter image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.inputField}
        />
        <div className={styles.popupActions}>
          <button className={styles.confirmButton} onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Yes'}
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

