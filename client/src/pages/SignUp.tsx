import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../store/api/user/userApi.slice";
import { Formik, Field, Form } from "formik";
import { toast, ToastContainer } from "react-toastify";
interface SignupFormValues {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  skills: string;
}
export default function Signup() {
  const navigte = useNavigate();
  const handleNavigate = () => {
    navigte("/login");
  };
  const initialValues: SignupFormValues = {
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    skills: ""
  };
  const [signUpAPI] = useSignUpMutation();

  const handleSignUp = async (values: SignupFormValues) => {
    const response = await signUpAPI({
      body: { ...values, skills: values?.skills?.split(",") }
    });

    if (response.data) {
      navigte("/login");
      return;
    }

    toast.error("Something went wrong");
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Join DevTinder</h1>
          <p className="text-slate-400 mt-2">
            Connect with developers around the world.
          </p>
        </div>
        <Formik<SignupFormValues>
          initialValues={initialValues}
          onSubmit={handleSignUp}
        >
          <Form className="space-y-5">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                First Name
              </label>

              <Field
                name="firstName"
                type="text"
                placeholder="John"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Last Name
              </label>

              <Field
                name="lastName"
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>

              <Field
                name="emailId"
                type="emailId"
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <Field
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Skills
              </label>

              <Field
                name="skills"
                type="text"
                placeholder="React, Node.js, MongoDB"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              Create Account
            </button>
          </Form>
        </Formik>

        <p className="text-center text-slate-400 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-500 hover:text-blue-400"
            onClick={handleNavigate}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
