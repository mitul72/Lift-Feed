"use client";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input, Textarea } from "@nextui-org/react";
import StyledDropzone from "./shared/StyledDropZone";
import { useState } from "react";
import { db, storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useUserAuth } from "@/context/auth-context";
import toast from "react-hot-toast";
import { useThread } from "@/context/threads";
import { getThreadsByPage } from "@/utils/firestore";

export default function CreateThreadModal({
  isOpen,
  onOpenChange,
  page,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  page: number;
}) {
  const { user } = useUserAuth();
  const { setThreads } = useThread();
  const [content, setContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<Array<File> | null>(null);

  const handleFileUpload = (file: Array<File>) => {
    setUploadedFile(file);
  };
  function makeid(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const handleCreateThread = async () => {
    try {
      if (content.length == 0 && !uploadedFile) {
        toast.error("Content or image is required to create a thread");
        return;
      }
      if (!user) {
        toast.error("You need to be logged in to create a thread");
      }
      const uid = user?.uid;
      const displayName = user?.displayName;
      if (uploadedFile) {
        if (uploadedFile[0].size > 5 * 1024 * 1024) {
          toast.error("File size should be less than 5MB");
          return;
        }
        // Upload the image to Firebase Storage
        const imageRef = ref(
          storage,
          `user-uploads/${uid}/${makeid(5)}/${uploadedFile[0].name}`
        );
        await uploadBytes(imageRef, uploadedFile[0]);

        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(imageRef);

        // Store the content and image URL in Firestore
        await addDoc(collection(db, "threads"), {
          uid,
          displayName,
          content,
          imageUrl,
          createdAt: new Date(),
        });
      } else {
        // Store only the content in Firestore
        await addDoc(collection(db, "threads"), {
          uid,
          displayName,
          content,
          createdAt: new Date(),
        });
      }

      setContent("");
      setUploadedFile(null);
      onOpenChange(false);
      // Fetch the updated threads and update the threads state
      const updatedThreads = await getThreadsByPage(page);
      setThreads(updatedThreads);
    } catch (error: any) {
      console.error("Error creating thread:", error);
      toast.error(error.message || "Error creating thread");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create Thread
            </ModalHeader>
            <ModalBody>
              <Textarea
                label="Content"
                placeholder="Enter content"
                className="mb-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <StyledDropzone onFileUpload={handleFileUpload} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleCreateThread}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
