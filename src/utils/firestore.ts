import { collection, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase";

// Function to get all threads
export const getAllThreads = async () => {
    try {
      const threadsRef = collection(db, "threads");
      const q = query(threadsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const threads = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return threads;
    } catch (error) {
      console.error("Error getting threads:", error);
      throw error;
    }
  };
  
// Function to get a thread by ID
export const getThreadById = async (threadId: string) => {
  try {
    const threadRef = doc(db, "threads", threadId);
    const threadSnapshot = await getDoc(threadRef);
    if (threadSnapshot.exists()) {
      return {
        id: threadSnapshot.id,
        ...threadSnapshot.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting thread:", error);
    throw error;
  }
};

// Function to delete a thread by ID
export const deleteThreadById = async (threadId: string) => {
    try {
      const threadRef = doc(db, "threads", threadId);
      await deleteDoc(threadRef);
      console.log("Thread deleted successfully");
    } catch (error) {
      console.error("Error deleting thread:", error);
      throw error;
    }
  };
  
  // Function to update a thread by ID
  export const updateThreadById = async (
    threadId: string,
    updatedData: Partial<Thread>
  ) => {
    try {
      const threadRef = doc(db, "threads", threadId);
      await updateDoc(threadRef, updatedData);
      console.log("Thread updated successfully");
    } catch (error) {
      console.error("Error updating thread:", error);
      throw error;
    }
  };
  
  // Interface for the Thread object (adjust according to your thread structure)
  interface Thread {
    content: string;
    imageUrl?: string;
    // Add other properties as needed
  }
  