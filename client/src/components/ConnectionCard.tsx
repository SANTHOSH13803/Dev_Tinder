import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import type { PendingRequestUser } from "@/types/user.type";
import { useReviewConnectionsMutation } from "@/store/api/user/userApi.slice";
import { toast } from "react-toastify";

interface Props {
  row: PendingRequestUser;
  refetchConnections: () => void;
}

const ConnectionCard = ({ row, refetchConnections }: Props) => {
  const [reviewConnectionApi] = useReviewConnectionsMutation();

  const handleRequest = async (status: "accepted" | "rejected") => {
    try {
      const resposne = await reviewConnectionApi({
        status,
        requestId: row.requestId
      }).unwrap();
      refetchConnections();
      console.log(resposne);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleConfirm = async () => {
    await handleRequest("accepted");
  };
  const handleReject = async () => {
    await handleRequest("rejected");
  };

  return (
    <div className="bg-base-300 hover:bg-base-200 mx-auto flex w-full items-center justify-between rounded-2xl p-4 shadow-md transition-all">
      {/* Left Section */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
          <AvatarImage src={row.photoURL} />
          <AvatarFallback>{row.firstName?.[0]}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold sm:text-lg">
            {row.firstName} {row.lastName}
          </h3>

          {row.age && (
            <p className="text-muted-foreground text-xs sm:text-sm">
              {row.age} years old
            </p>
          )}

          {row.skills?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {row.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="ml-3 flex flex-col gap-2 sm:flex-row">
        <Button
          className="w-24 bg-green-500 text-white hover:bg-green-600"
          onClick={handleConfirm}
        >
          <Check className="mr-1 h-4 w-4" />
          Accept
        </Button>

        <Button variant="destructive" className="w-24" onClick={handleReject}>
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  );
};

export default ConnectionCard;
