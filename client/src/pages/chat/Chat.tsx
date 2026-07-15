import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/pages/chat/ChatHeader";
import MessageBubble from "@/pages/chat/MessageBubble";
import MessageInput from "@/pages/chat/MessageInput";

const messages = [
  {
    id: 1,
    sender: "other",
    text: "Hello 👋",
    time: "10:20 AM"
  },
  {
    id: 2,
    sender: "me",
    text: "Hi Rahul!",
    time: "10:21 AM"
  },
  {
    id: 3,
    sender: "other",
    text: "How are you?",
    time: "10:22 AM"
  },
  {
    id: 4,
    sender: "me",
    text: "Doing great 😄",
    time: "10:23 AM"
  }
];

export default function Chat() {
  return (
    <div className="flex h-full flex-col bg-background">
      <ChatHeader />

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {[...messages, ...messages, ...messages, ...messages].map(
            (message) => (
              <MessageBubble key={message.id} {...message} />
            )
          )}
        </div>
      </ScrollArea>

      <MessageInput />
    </div>
  );
}
