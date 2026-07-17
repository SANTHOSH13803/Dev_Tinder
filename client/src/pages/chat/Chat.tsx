import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/pages/chat/ChatHeader";
import MessageBubble from "@/pages/chat/MessageBubble";
import MessageInput from "@/pages/chat/MessageInput";
import {
  useGetChatQuery,
  useGetUserByIdQuery
} from "@/store/api/user/userApi.slice";
import { useAppSelector } from "@/store/hook";
import createSocketInstance from "@/utils/socket";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

// const messages = [
//   {
//     id: 1,
//     sender: "other",
//     text: "Hello 👋",
//     time: "10:20 AM"
//   },
//   {
//     id: 2,
//     sender: "me",
//     text: "Hi Rahul!",
//     time: "10:21 AM"
//   },
//   {
//     id: 3,
//     sender: "other",
//     text: "How are you?",
//     time: "10:22 AM"
//   },
//   {
//     id: 4,
//     sender: "me",
//     text: "Doing great 😄",
//     time: "10:23 AM"
//   }
// ];

export default function Chat() {
  const [messages, setMessages] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const { user } = useAppSelector((state) => state.user);

  const { userId: toUserId } = useParams<string>();

  const {
    data: toUserData,
    isLoading,
    isFetching
  } = useGetUserByIdQuery({ id: toUserId as string }, { skip: !toUserId });
  const {
    data: chatMetaData,
    isLoading: chatLoading,
    isFetching: chatFetching
  } = useGetChatQuery({ toUserId: toUserId }, { skip: !toUserId });
  const toUser = toUserData?.data;
  const chatData = chatMetaData?.data;
  const messagesData = useMemo(() => {
    return (
      chatData?.messages?.map((each: any) => {
        const sender = user?._id === each.senderId ? "me" : "other";
        return { sender, text: each.message, time: each.time };
      }) || []
    );
  }, [chatData, user]);
  const handleSend = () => {
    // sending the message to socket to backent
    const socket = createSocketInstance();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId: user?._id,
      toUserId,
      text: inputValue
    });
  };
  useEffect(() => {
    if (!user) return;
    const socket = createSocketInstance();
    socket.emit("joinChat", {
      userId: user?._id,
      toUserId,
      firstName: user?.firstName
    });

    socket.on("messageReceived", ({ firstName, message }) => {
      setMessages((prev: any) => [
        ...prev,
        {
          _id: Date.now().toString(),
          sender: firstName === user.firstName ? "me" : "other",
          text: message,
          time: format(new Date(), "hh:KK aaa")
        }
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, toUserId]);
  return (
    <div className="flex h-screen flex-col bg-background">
      <LoadingOverlay open={isLoading || isFetching} />
      <ChatHeader firstName={toUser?.firstName || ""} />

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {[...messagesData, ...messages]?.map((message: any) => (
            <MessageBubble key={message._id} {...message} />
          ))}
        </div>
      </ScrollArea>

      <MessageInput
        value={inputValue}
        setValue={setInputValue}
        handleSend={handleSend}
      />
    </div>
  );
}
