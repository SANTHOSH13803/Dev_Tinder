import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { useAppSelector } from "@/store/hook";
import ProfilePicAvatar from "@/components/ProfilePicAvatar";
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

  const { user } = useAppSelector((state) => state.user);

  const photos = [
    user?.photoURL
    // user?.photoURL,
    // user?.photoURL,
    // user?.photoURL
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Card className="border-none bg-base-300 shadow-lg">
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

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {/* Upload Photo Card */}
              <button
                className="
                  flex
                  h-48
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  transition
                  hover:bg-accent
                "
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="h-8 w-8" />
                  <span>Add Photo</span>
                </div>
              </button>

              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt="profile"
                  className="
                    h-48
                    w-full
                    rounded-xl
                    object-cover
                  "
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
