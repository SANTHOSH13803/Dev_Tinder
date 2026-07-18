import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user.type";

type ChatHeaderProps = Pick<User, "firstName"> & { isOnline: boolean };
export default function ChatHeader({
  firstName,
  isOnline = false
}: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-1 flex items-center gap-4 border-b bg-background px-4 py-3">
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
        <AvatarFallback>{firstName?.[0] || ""}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h2 className="font-semibold">{firstName}</h2>

        <p className={`text-sm text-${isOnline ? "green" : "red"}-500`}>
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </header>
  );
}
