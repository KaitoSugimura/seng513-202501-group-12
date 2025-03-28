import { fireStore } from "../util/firebase";
import { addDoc, collection } from "firebase/firestore";

type FirestoreData = Record<string, any>;

const useFireStore = () => {
  const addDocument = async (collectionName: string, data: FirestoreData) => {
    try {
      const docRef = await addDoc(collection(fireStore, collectionName), data);
      return docRef.id;
    } catch (err) {
      console.error("Error adding document: ", err);
      return null;
    }
  };

  return { addDocument };
};

export default useFireStore;
