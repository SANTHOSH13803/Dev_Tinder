import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store/hook";
import type { User } from "../store/slice/user";
import { useUpdateProfileMutation } from "../store/api/user/userApi.slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Chips } from "primereact/chips";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
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
const inputClass =
  "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 transition focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const errorClass = "mt-1 text-sm font-medium text-red-500";
const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { user: userData } = useAppSelector((state) => state.user);
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
  const initialValues: ProfileFormValues = user;

  const updateField = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    await updateProfileApi({ data: values });
    setIsEdit(false);
    // no need to update store beacuase we wrote providesTags and invalidateTags in RTK QUIERY
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

  return (
    <div className="mx-auto flex md:h-full h-[calc(100vh-64px)] max-w-7xl gap-8 p-6 flex-col md:flex-row md:justify-center md:items-center">
      {" "}
      <div className="w-full md:max-w-1/2  h-fit rounded-3xl bg-gray-700 p-8 shadow-xl">
        {" "}
        {isEdit && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stale-100 ">Edit Profile</h1>

            <p className="mt-2 text-slate-300">
              Update your profile information.
            </p>
          </div>
        )}
        {/* Formik here */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className={labelClass}>First Name</label>
                  <Field
                    name="firstName"
                    className={inputClass}
                    disabled={!isEdit}
                    onChange={updateField}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className={errorClass}
                  />
                </div>
                {/* Last Name */}

                <div>
                  <label className={labelClass}>Last Name</label>
                  <Field
                    name="lastName"
                    className={inputClass}
                    disabled={!isEdit}
                    onChange={updateField}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className={errorClass}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className={labelClass}>Age</label>
                  <Field
                    name="age"
                    type="number"
                    className={inputClass}
                    disabled={!isEdit}
                    onChange={updateField}
                  />
                  <ErrorMessage
                    name="age"
                    component="p"
                    className={errorClass}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className={labelClass}>Gender</label>

                  <Field
                    as="select"
                    name="gender"
                    className={inputClass}
                    disabled={!isEdit}
                    onChange={updateField}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                </div>
              </div>

              <div>
                <label className={labelClass}>Photo URL</label>

                <Field
                  name="photoURL"
                  className={inputClass}
                  disabled={!isEdit}
                  onChange={updateField}
                />

                <ErrorMessage
                  name="photoURL"
                  component="p"
                  className={errorClass}
                />
              </div>

              <div>
                <label className={labelClass}>About</label>

                <Field
                  as="textarea"
                  name="about"
                  rows={4}
                  className={inputClass}
                  disabled={!isEdit}
                  onChange={updateField}
                />

                <ErrorMessage
                  name="about"
                  component="p"
                  className={errorClass}
                />
              </div>

              <div>
                <label className={labelClass}>Skills (comma separated)</label>

                <Field name="skills">
                  {({ field, form }: any) => {
                    return (
                      <input
                        className={inputClass}
                        value={field.value}
                        disabled={!isEdit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          form.setFieldValue("skills", e.target.value);
                          setUser((prv) => ({
                            ...prv,
                            skills: e.target.value.split(",")
                          }));
                        }}
                      />
                    );
                  }}
                </Field>
              </div>
              {isEdit ? (
                <button
                  type={"submit"}
                  disabled={isSubmitting}
                  className="mt-4 w-full rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                >
                  {`Save Profile`}
                </button>
              ) : (
                <button
                  type={"button"}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(e.currentTarget.type);

                    setIsEdit(true);
                  }}
                  className="mt-4 w-full rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                >
                  {`Edit Profile`}
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
    // <div className="mx-auto h-full flex   md:flex-row md:justify-center md:items-center">
    //   <CardDemo />
    // </div>
    // <Formik
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    //   enableReinitialize
    //   onSubmit={handleSubmit}
    // >
    //   {({ values, handleChange, isSubmitting, setFieldValue }) => (
    //     <Form className="w-full h-full m-10 p-6 flex justify-center items-center">
    //       {" "}
    //       <Card className="w-full max-w-4xl overflow-auto bg-gray-700 border-none">
    //         <CardContent className="space-y-6 pt-6">
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             <div className="grid gap-2">
    //               <Label htmlFor="firstName">First Name</Label>
    //               <Input
    //                 id="firstName"
    //                 name="firstName"
    //                 value={values.firstName}
    //                 onChange={handleChange}
    //                 disabled={!isEdit}
    //               />
    //               <ErrorMessage
    //                 name="firstName"
    //                 component="p"
    //                 className="text-red-500 text-sm"
    //               />
    //             </div>

    //             <div className="grid gap-2">
    //               <Label htmlFor="lastName">Last Name</Label>
    //               <Input
    //                 id="lastName"
    //                 name="lastName"
    //                 value={values.lastName}
    //                 onChange={handleChange}
    //                 disabled={!isEdit}
    //               />
    //               <ErrorMessage
    //                 name="lastName"
    //                 component="p"
    //                 className="text-red-500 text-sm"
    //               />
    //             </div>
    //           </div>

    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             <div className="grid gap-2">
    //               <Label htmlFor="age">Age</Label>
    //               <Input
    //                 id="age"
    //                 name="age"
    //                 type="number"
    //                 value={values.age}
    //                 onChange={handleChange}
    //                 disabled={!isEdit}
    //               />
    //             </div>

    //             <div className="grid gap-2">
    //               <Label htmlFor="gender">Gender</Label>

    //               <Select
    //                 value={values.gender}
    //                 disabled={!isEdit}
    //                 onValueChange={(value) => setFieldValue("gender", value)}
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue placeholder="Select Gender" />
    //                 </SelectTrigger>

    //                 <SelectContent>
    //                   <SelectItem value="male">Male</SelectItem>
    //                   <SelectItem value="female">Female</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //             </div>
    //           </div>

    //           <div className="grid gap-2">
    //             <Label htmlFor="photoURL">Photo URL</Label>

    //             <Input
    //               id="photoURL"
    //               name="photoURL"
    //               value={values.photoURL}
    //               onChange={handleChange}
    //               disabled={!isEdit}
    //             />
    //           </div>

    //           <div className="grid gap-2">
    //             <Label htmlFor="about">About</Label>

    //             <Textarea
    //               id="about"
    //               name="about"
    //               value={values.about}
    //               onChange={handleChange}
    //               disabled={!isEdit}
    //               rows={4}
    //             />
    //           </div>

    //           <div className="grid gap-2">
    //             <Label>Skills</Label>

    //             <Chips
    //               value={values.skills}
    //               disabled={!isEdit}
    //               onChange={(e) => setFieldValue("skills", e.value)}
    //             />
    //           </div>
    //         </CardContent>
    //         <CardFooter>
    //           {isEdit ? (
    //             <Button
    //               type="submit"
    //               className="w-full"
    //               disabled={isSubmitting}
    //             >
    //               Save Profile
    //             </Button>
    //           ) : (
    //             <Button
    //               type="button"
    //               className="w-full"
    //               onClick={() => setIsEdit(true)}
    //             >
    //               Edit Profile
    //             </Button>
    //           )}
    //         </CardFooter>
    //       </Card>
    //     </Form>
    //   )}
    // </Formik>
  );
};

export default Profile;

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      {/* <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader> */}
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}

export function InputGrid() {
  return (
    <FieldGroup className="grid max-w-sm grid-cols-2">
      <Field>
        <FieldLabel htmlFor="first-name">First Name</FieldLabel>
        <Input id="first-name" placeholder="Jordan" />
      </Field>
      <Field>
        <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
        <Input id="last-name" placeholder="Lee" />
      </Field>
    </FieldGroup>
  );
}
