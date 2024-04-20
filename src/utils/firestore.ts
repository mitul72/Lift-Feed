import { collection, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, orderBy, startAfter, limit, QueryDocumentSnapshot, DocumentData, getCountFromServer } from "firebase/firestore";
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
  
export const getThreadsByPage = async (pageNumber: number, pageSize: number = 12) => {
    try {
      const threadsRef = collection(db, "threads");
      let q = query(threadsRef, orderBy("createdAt", "desc"), limit(pageSize));
  
      // Calculate the number of threads to skip based on the page number
      const threadsToSkip = (pageNumber - 1) * pageSize;
  
      // Fetch the first thread of the previous page to use as the starting point
      if (threadsToSkip > 0) {
        const firstThreadOfPreviousPageQuery = query(
          threadsRef,
          orderBy("createdAt", "desc"),
          limit(threadsToSkip)
        );
        const firstThreadOfPreviousPageSnapshot = await getDocs(firstThreadOfPreviousPageQuery);
        const lastThreadOfPreviousPage = firstThreadOfPreviousPageSnapshot.docs[firstThreadOfPreviousPageSnapshot.docs.length - 1];
        q = query(q, startAfter(lastThreadOfPreviousPage));
      }
  
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

export const getTotalThreadCount = async () => {
    try {
      const threadsRef = collection(db, "threads");
      const snapshot = await getCountFromServer(threadsRef);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error getting total thread count:", error);
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
  