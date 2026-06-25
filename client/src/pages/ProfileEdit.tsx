import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hook";
import type { User } from "../store/slice/user";
import { useUpdateProfileMutation } from "../store/api/user/userApi.slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import ProfilePicAvatar from "@/components/ProfilePicAvatar";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
type ProfileFormValues = {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  about: string;
  photoURL: string;
  skills: string[];
  _id: string;
};

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .min(2, "Minimum 2 characters"),

  lastName: Yup.string()
    .required("Last Name is required")
    .min(2, "Minimum 2 characters"),

  age: Yup.number().required("Age is required").min(18, "Must be 18 or older"),

  gender: Yup.string(),

  about: Yup.string().max(200, "Maximum 200 characters"),

  photoURL: Yup.string().url("Invalid URL"),

  skills: Yup.array().of(Yup.string())
});
const ProfileEdit = () => {
  const [skillInput, setSkillInput] = useState("");
  const { user: userData } = useAppSelector((state) => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isPhotoDeleted, setIsPhotoDeleted] = useState(false);
  const [updateProfileApi] = useUpdateProfileMutation();
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    age: 0,
    _id: "",
    gender: "",
    about: "",
    skills: [],
    photoURL: ""
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const initialValues: ProfileFormValues = user;

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      });

      if (file) {
        formData.append("photo", file);
      }

      await updateProfileApi({ data: formData });
      // no need to update store beacuase we wrote providesTags and invalidateTags in RTK QUIERY
    } catch (error) {
      toast.error("Something went wrong");
      setIsSaving(false);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (userData) {
      setUser({
        firstName: userData?.firstName ?? "",
        lastName: userData?.lastName ?? "",
        age: userData?.age ?? 0,
        _id: userData?._id ?? "",
        gender: userData?.gender ?? "",
        about: userData?.about ?? "",
        skills: userData?.skills ?? [],
        photoURL: userData?.photoURL ?? ""
      });
    }
  }, [userData]);
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const defaultPhotoUrl =
    "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80";
  const avatarUrl = isPhotoDeleted
    ? defaultPhotoUrl
    : previewUrl || user.photoURL;
  //   const firstName = user.firstName;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsPhotoDeleted(false);
    setOpen(false);
  };
  const handleDelete = () => {
    setUser((prev) => ({
      ...prev,
      photoURL: defaultPhotoUrl
    }));
    setIsPhotoDeleted(true);
    setFile(null);
    setOpen(false);
  };

  const items = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" }
  ];
  return (
    <>
      <LoadingOverlay text="Saving Profile" open={isSaving} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, isSubmitting, setFieldValue }) => (
          <Form className="space-y-4 m-5 sm:max-w-125 sm:mx-auto ">
            <Card>
              <CardContent className="space-y-8 pt-6">
                <h1 className="text-3xl font-bold">Edit Profile</h1>

                {/* Profile Header */}

                <div className="flex flex-col gap-4 rounded-2xl bg-muted p-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <ProfilePicAvatar
                        photoURL={avatarUrl}
                        open={open}
                        setOpen={setOpen}
                        firstName={user.firstName}
                        handleUpload={handleUpload}
                        handleDelete={handleDelete}
                        className={"h-20 w-20"}
                      />
                    </div>

                    <div>
                      <h2 className="text-sm sm:text-xl font-semibold overflow-hidden">
                        {user.firstName.toLowerCase()}_
                        {user.lastName.toLowerCase()}
                      </h2>

                      <p className="text-sm text-muted-foreground overflow-hidden">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Names */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>

                    <Input
                      id="firstName"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>

                    <Input
                      id="lastName"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Bio */}

                <div className="grid gap-2">
                  <Label htmlFor="about">Bio</Label>

                  <Textarea
                    id="about"
                    name="about"
                    rows={5}
                    maxLength={150}
                    value={values.about}
                    onChange={handleChange}
                  />

                  <div className="text-muted-foreground text-right text-xs">
                    {values.about.length}/150
                  </div>
                </div>

                {/* Skills */}

                <div className="grid gap-2">
                  <Label>Skills</Label>

                  <Input
                    value={skillInput}
                    placeholder="Type skill and press Enter"
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();

                        const skill = skillInput.trim();

                        if (!skill) return;

                        if (!values.skills.includes(skill)) {
                          setFieldValue("skills", [...values.skills, skill]);
                        }

                        setSkillInput("");
                      }
                    }}
                  />

                  <div className="mt-2 flex flex-wrap gap-2">
                    {values.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="cursor-pointer px-3 py-1"
                        onClick={() =>
                          setFieldValue(
                            "skills",
                            values.skills.filter((item) => item !== skill)
                          )
                        }
                      >
                        {skill} ✕
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Age & Gender */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>

                    <Input
                      id="age"
                      type="number"
                      name="age"
                      value={values.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      name="gender"
                      value={values.gender}
                      onValueChange={(value) => {
                        if (value) {
                          setFieldValue("gender", value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ProfileEdit;
