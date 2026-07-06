import { useNavigate } from "react-router-dom";
import { EllipsisVertical, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { useAppSelector } from "@/store/hook";
import ProfilePicAvatar from "@/components/ProfilePicAvatar";
import { useRef, useState } from "react";
import {
  useDeletePhotoMutation,
  useGetPhotosQuery,
  useSavePhotoMutation
} from "@/store/api/photos/photo.Api.slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { toast } from "react-toastify";
import { LoadingOverlay } from "@/components/LoadingOverlay";
// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   about: string;
//   skills: string[];
//   photoURL: string;
//   photos: string[];
// }
const ProfileView = () => {
  const navigate = useNavigate();
  const filesRef = useRef<HTMLInputElement>(null);

  const { user } = useAppSelector((state) => state.user);

  const [savePhotoApi, { isLoading: saveLoading }] = useSavePhotoMutation();
  const [deletePhotoApi, { isLoading: deleteLoading }] =
    useDeletePhotoMutation();
  const { data: photosData, isLoading } = useGetPhotosQuery();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("photo", file);
      const response = await savePhotoApi({ data: formData }).unwrap();
      if (response) {
        toast.success("Photo uploaded successfully");
      }
    } catch (error) {
      console.warn("Something went wrong", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deletePhotoApi({ photoId: selectedId }).unwrap();
      if (response.success) {
        setShowDeleteDialog(false);
        toast.success("Photo Deleted successfully");
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <LoadingOverlay open={isLoading || saveLoading || deleteLoading} />

      <Card className="border-none bg-card shadow-lg">
        <CardContent className="p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <ProfilePicAvatar
                  photoURL={user?.photoURL ?? ""}
                  firstName={user?.firstName ?? ""}
                  className="h-36 w-36 border-4 border-background"
                  isView={true}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>

                <p className="text-muted-foreground mt-2">{user?.about}</p>
              </div>
              {/* follow buttons */}
              {/* <div className="flex flex-wrap gap-2">

              </div> */}
              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div>
                <Button onClick={() => navigate("/profile/edit")}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Photos */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Photos</h2>

            <div className="grid  gap-4 md:grid-cols-3 lg:grid-cols-4">
              {/* Upload Photo Card */}
              <button
                className="
                  flex
                  h-70
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  transition
                  hover:bg-accent
                "
                type="button"
                onClick={() => filesRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="h-8 w-8" />
                  <span>Add Photo</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={filesRef}
                  onChange={handleUpload}
                />
              </button>

              {photosData?.data?.map((photo) => (
                <div
                  className="w-full h-70 rounded-xl relative "
                  key={photo._id}
                >
                  <img
                    src={photo.url}
                    alt="profile"
                    width={300}
                    height={280}
                    loading="lazy"
                    decoding="async"
                    className="
                    h-full
                    w-full
                    object-cover
                    "
                  />
                  <div className="text-white absolute top-1 right-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setSelectedId(photo._id);
                      }}
                    >
                      <EllipsisVertical />
                    </Button>
                  </div>
                </div>
              ))}

              <Dialog
                open={showDeleteDialog}
                onOpenChange={(val) => setShowDeleteDialog(val)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Photo</DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete?.()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Photo
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
