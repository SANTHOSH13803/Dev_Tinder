import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

export default function MessageInput() {
  return (
    <div className="border-t bg-background p-4 flex-1 sticky bottom-0">
      <div className="mx-auto flex max-w-3xl gap-3">
        <Input
          placeholder="Type your message..."
          className="h-12 rounded-full"
        />

        <Button size="icon" className="h-12 w-12 rounded-full">
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
