import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Pencil, Trash2, Upload } from "lucide-react";
import type { ComponentProps } from "react";

type AvatarProps = {
  photoURL: string;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  firstName: string;
  handleUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete?: () => void;
  isView?: boolean;
} & ComponentProps<typeof Avatar>;

const ProfilePicAvatar = ({
  photoURL,
  open,
  setOpen,
  firstName,
  handleUpload,
  handleDelete,
  isView = false,
  ...props
}: AvatarProps) => {
  return (
    <>
      <Avatar {...props}>
        <AvatarImage src={photoURL} />
        <AvatarFallback>{firstName}</AvatarFallback>
      </Avatar>
      {!isView && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="absolute -bottom-1 -right-1 rounded-full"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile Photo</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <label htmlFor="photo-upload">
                <Button className="w-full" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </span>
                </Button>
              </label>

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleUpload?.(e);
                }}
              />

              <Button variant="destructive" onClick={() => handleDelete?.()}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Photo
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProfilePicAvatar;
