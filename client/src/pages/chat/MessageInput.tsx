import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import type React from "react";

type MessageInputProps = {
  value: string;
  setValue: React.Dispatch<string>;
  handleSend?: (value: string) => void;
};
export default function MessageInput({
  value,
  setValue,
  handleSend
}: MessageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };
  const sendHandleWrapper = () => {
    handleSend?.(value);
    setValue("");
  };
  return (
    <div className="border-t bg-background p-4  sticky bottom-0">
      <div className="mx-auto flex max-w-3xl gap-3">
        <Input
          id="chat-text-box"
          value={value}
          onChange={handleChange}
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
