import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Check, X, SendHorizontal } from "lucide-react";
import type { PendingRequestUser } from "@/types/user.type";
import { useReviewConnectionsMutation } from "@/store/api/user/userApi.slice";
import { useNavigate } from "react-router-dom";

interface Props {
  row: PendingRequestUser;
  refetchConnections: () => void;
  view?: boolean;
}

const ConnectionCard = ({ row, refetchConnections, view = false }: Props) => {
  const [reviewConnectionApi] = useReviewConnectionsMutation();
  const navigate = useNavigate();
  const handleRequest = async (status: "accepted" | "rejected") => {
    try {
      await reviewConnectionApi({
        status,
        requestId: row.requestId
      }).unwrap();
      refetchConnections();
    } catch (error) {
      console.warn(error);
    }
  };

  const handleConfirm = async () => {
    await handleRequest("accepted");
  };
  const handleReject = async () => {
    await handleRequest("rejected");
  };

  const navigateToMessage = () => {
    navigate(`/chat/${row?._id}`);
  };

  return (
    <div
      className="
    group
    flex
    flex-col
    gap-6
    rounded-3xl
    border
    border-border
    bg-card
    p-5
    shadow-md
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-xl

    sm:flex-row
    sm:items-center
    sm:justify-between
  "
    >
      {/* Left Section */}
      <div className="flex flex-1 items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="h-16 w-16 border-2 border-primary/40 shadow-lg transition group-hover:scale-105 sm:h-20 sm:w-20">
            <AvatarImage src={row.photoURL} />
            <AvatarFallback>{row.firstName?.[0]}</AvatarFallback>
          </Avatar>

          <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate bg-linear-to-r from-foreground to-primary bg-clip-text text-lg font-bold text-transparent sm:text-xl">
            {row.firstName} {row.lastName}
          </h2>

          {row.age && (
            <p className="mt-1 text-sm text-muted-foreground">
              {row.age} years old
            </p>
          )}

          {row.skills?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {row.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="
                rounded-full
                bg-secondary
                px-3
                py-1
                text-xs
                font-medium
                text-secondary-foreground
                transition-all
                hover:bg-primary
                hover:text-primary-foreground
              "
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div
        className={`
      flex
      w-full
      gap-3

      sm:w-auto

      ${view ? "justify-end" : "flex-col sm:flex-row"}
    `}
      >
        {view ? (
          <Button
            onClick={navigateToMessage}
            className="
          group/button
          w-full
          sm:w-auto
          rounded-2xl
          bg-linear-to-r
          from-indigo-600
          to-blue-600
          px-8
          py-6
          text-white
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-xl
        "
          >
            <SendHorizontal className="mr-2 h-5 w-5 transition-transform group-hover/button:translate-x-1" />
            Message
          </Button>
        ) : (
          <>
            <Button
              onClick={handleConfirm}
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 sm:w-auto"
            >
              <Check className="mr-2 h-4 w-4" />
              Accept
            </Button>

            <Button
              variant="destructive"
              onClick={handleReject}
              className="w-full rounded-xl sm:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
