import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import createSocketInstance from "@/utils/socket";
import { SendHorizontal } from "lucide-react";
import type React from "react";
import { useMemo, useRef } from "react";

type MessageInputProps = {
  value: string;
  setValue: React.Dispatch<string>;
  handleSend?: (value: string) => void;
  chatId?: string;
  userId?: string;
};
export default function MessageInput({
  value,
  setValue,
  handleSend,
  chatId,
  userId
}: MessageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };
  const isTyping = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const socket = useMemo(() => {
    return createSocketInstance();
  }, []);
  const sendHandleWrapper = () => {
    handleSend?.(value);
    setValue("");
    socket.emit("stop-typing", { chatId, userId });
    isTyping.current = false;
  };

  const typingSocket = () => {
    const typing = isTyping.current;

    if (!typing) {
      socket.emit("typing", { chatId, userId });
      isTyping.current = true;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      socket.emit("stop-typing", { chatId, userId });
      isTyping.current = false;
    }, 1000);
  };

  const onChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    typingSocket();
    handleChange(e);
  };

  return (
    <div className="border-t bg-background p-4  sticky bottom-0">
      <div className="mx-auto flex max-w-3xl gap-3">
        <Input
          id="chat-text-box"
          value={value}
          onChange={(e) => onChangeWrapper(e)}
          placeholder="Type your message..."
          className="h-12 rounded-full"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              sendHandleWrapper();
            }
          }}
        />

        <Button
          size="icon"
          className="h-12 w-12 rounded-full"
          type="button"
          onClick={sendHandleWrapper}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
