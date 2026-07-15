import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ChatHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 flex items-center gap-4 border-b bg-background px-4 py-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Avatar className="h-12 w-12">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>R</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h2 className="font-semibold">Rahul</h2>
        <p className="text-sm text-green-500">Online</p>
      </div>
    </header>
  );
}
