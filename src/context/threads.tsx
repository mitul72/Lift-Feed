"use client";
import { useContext, createContext, useState } from "react";

interface ThreadContextType {
  threads: any;
  setThreads: any;
}

const ThreadContext = createContext<ThreadContextType>({
  threads: [],
  setThreads: () => {},
});

export const useThread = () => {
  return useContext(ThreadContext);
};

export const ThreadProvider = ({ children }: any) => {
  const [threads, setThreads] = useState<any>(null);

  return (
    <ThreadContext.Provider value={{ threads, setThreads }}>
      {children}
    </ThreadContext.Provider>
  );
};
