import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/pages/chat/ChatHeader";
import MessageBubble from "@/pages/chat/MessageBubble";
import MessageInput from "@/pages/chat/MessageInput";
import {
  useGetMessagesQuery,
  useGetUserByIdQuery,
  useLazyGetChatQuery
} from "@/store/api/user/userApi.slice";
import { useAppSelector } from "@/store/hook";
import createSocketInstance from "@/utils/socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Marker, MarkerContent } from "@/components/ui/marker";

// const messageResponse = {
//   _id: "6a61eeb0485aec9691bc6a03",
//   chatId: "6a61e7f53c5e3af8e7c66b7b",
//   senderId: "6a5df242f292102c02b52bc6",
//   message: "Hi",
//   createdAt: "",
//   updatedAt: ""
// };

// type MessageResponseType = typeof messageResponse;

export default function Chat() {
  const [messages, setMessages] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const [isOnline, setIsOnline] = useState(false);

  const [chatId, setChatId] = useState("");

  const { userId: toUserId } = useParams<string>();

  const {
    data: toUserData,
    isLoading,
    isFetching
  } = useGetUserByIdQuery({ id: toUserId as string }, { skip: !toUserId });

  const [chatIdApi] = useLazyGetChatQuery();
  const {
    data: messagesMeta,
    isLoading: messagesLoading,
    isFetching: messagesFetching
  } = useGetMessagesQuery({ chatId: chatId as string }, { skip: !chatId });

  const fetchChat = async () => {
    try {
      // fetching chat id
      const chatIdResponse = await chatIdApi({ toUserId }).unwrap();
      if (!chatIdResponse.success) return;
      const chatId = chatIdResponse.data.chatId;
      setIsOnline(chatIdResponse?.data?.isOnline);
      setChatId(chatId);
    } catch (error) {
      console.warn(error);
    }
  };

  const toUser = toUserData?.data;

  const handleSend = () => {
    // sending the message to socket to backent
    const socket = createSocketInstance();
    socket.emit("sendMessage", {
      chatId,
      userId: user?._id,
      text: inputValue
    });
  };

  const generateSocket = () => {
    const socket = createSocketInstance();
    socket.emit("joinChat", {
      chatId
    });
    socket.on("messageReceived", ({ message }) => {
      setMessages((prev: any) => [
        ...prev,
        {
          _id: message._id,
          sender: message.senderId === user?._id ? "me" : "other",
          text: message.message,
          time: format(new Date(message.createdAt), "hh:KK aaa")
        }
      ]);
    });

    socket.on("user-online", ({ userId }) => {
      if (userId === toUserId) {
        setIsOnline(true);
      }
    });

    socket.on("user-offline", ({ userId }) => {
      if (userId === toUserId) {
        setIsOnline(false);
      }
    });

    return socket;
  };

  useEffect(() => {
    if (!user) return;
    const socket = generateSocket();

    return () => {
      socket.off("messageReceived");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [user, toUserId, chatId]);

  useEffect(() => {
    fetchChat();
  }, [toUserId]);

  useEffect(() => {
    if (!messagesMeta?.data) return;

    const modififiedData =
      messagesMeta?.data?.map((message: any) => ({
        ...message,
        _id: message?._id,
        sender: message.senderId?._id === user?._id ? "me" : "other",
        text: message.message,
        time: format(new Date(message.createdAt), "hh:mm aaa")
      })) || [];

    setMessages(modififiedData);
  }, [messagesMeta]);

  useEffect(() => {
    const socket = createSocketInstance();

    socket.on("typing", ({ userId }) => {
      // if it's the person I'm chatting with
      if (toUserId === userId) {
        setOtherUserTyping(true);
      }
    });

    socket.on("stop-typing", ({ userId }) => {
      if (toUserId === userId) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [toUserId]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <LoadingOverlay
        open={isLoading || isFetching || messagesLoading || messagesFetching}
      />
      <ChatHeader firstName={toUser?.firstName || ""} isOnline={isOnline} />

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages?.map((message: any) => (
            <MessageBubble key={message._id} {...message} />
          ))}
          {otherUserTyping && (
            <Marker role="status" className=" flex justify-end lg:mb-4">
              <MarkerContent className="shimmer">
                <span className="font-medium">{toUser?.firstName}</span> is
                typing...
              </MarkerContent>
            </Marker>
          )}
        </div>
      </ScrollArea>

      <MessageInput
        value={inputValue}
        setValue={setInputValue}
        handleSend={handleSend}
        chatId={chatId}
        userId={user?._id}
      />
    </div>
  );
}
