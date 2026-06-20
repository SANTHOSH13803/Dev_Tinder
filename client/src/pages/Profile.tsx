import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card } from "./Feed";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store/hook";
import type { User } from "../store/slice/user";
import { useUpdateProfileMutation } from "../store/api/user/userApi.slice";
import { Chips, type ChipsChangeEvent } from "primereact/chips";

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
      <div className="w-full md:w-1/2 h-fit rounded-3xl bg-gray-700 p-8 shadow-xl">
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
  );
};

export default Profile;
