"use client";
import Link from "next/link";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import CreateThreadModal from "./CreateThreadModal";
import {
  getAllThreads,
  getThreadsByPage,
  getTotalThreadCount,
} from "@/utils/firestore";
import { useEffect, useState } from "react";
import { Pagination, Spinner } from "@nextui-org/react";
import { useThread } from "@/context/threads";
import { Image } from "@nextui-org/image";

export function BlogPosts() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { threads, setThreads } = useThread();
  const [page, setPage] = useState(1);
  const [totalThreads, setTotalThreads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        //const allThreads = await getAllThreads();
        const threadsByPage = await getThreadsByPage(page);
        const totalThreads = await getTotalThreadCount();
        const totalPages = Math.ceil(totalThreads / 12);
        console.log(threadsByPage.length);
        setTotalPages(totalPages);
        setTotalThreads(totalThreads);
        setThreads(threadsByPage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchThreads();
  }, [page]);
  if (!threads)
    return (
      <div className="flex justify-center items-center min-h-[80dvh]">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div className="flex flex-col min-h-[100dvh] mx-10 gap-5">
      <div className="flex-1 bg-gray-100/90 dark:bg-gray-800/90 rounded-md ">
        <div className="flex items-center mt-10  justify-around">
          <h1 className="text-xl font-bold uppercase ">Threads</h1>
          <Button onPress={onOpen} className="" color="primary">
            Create Thread
          </Button>
          <CreateThreadModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
        <div className="container grid items-start gap-6 px-4 py-6 md:py-12 lg:px-6 lg:gap-10 xl:grid-cols-2 xl:gap-16">
          {threads.map((thread: any) => (
            <BlogPost key={thread.id} thread={thread} />
          ))}
        </div>
      </div>
      <Pagination
        className="ml-2"
        color="primary"
        size="lg"
        total={totalPages}
        page={page}
        onChange={setPage}
      />
    </div>
  );
}

function BlogPost({ thread }: any) {
  return (
    <div className="space-y-4 xl:order-last">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Avatar className="w-12 h-12">
            <AvatarImage alt="Avatar" src="/avatar.jpg" />
          </Avatar>
          <div className="flex flex-col">
            <Link
              className="font-semibold hover:underline underline-offset-4"
              href="#"
            >
              {thread.displayName}
            </Link>
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(thread.createdAt.toDate()).toLocaleString()}
            </time>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-md p-2 hover:bg-gray-100/40 focus-visible:outline-none dark:hover:bg-gray-800/40">
            <CircleEllipsisIcon className="w-4 h-4" />
            <span className="sr-only">Menu</span>
          </div>
        </div>
      </div>
      <div className="text-base leading-8 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-2 w-full ">
          <p className="mr-auto ml-10">{thread.content}</p>
          {thread.imageUrl && (
            <Image
              alt="Image"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              height="250"
              src={thread.imageUrl}
              width="500"
              isBlurred
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CircleEllipsisIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M17 12h.01" />
      <path d="M12 12h.01" />
      <path d="M7 12h.01" />
    </svg>
  );
}
