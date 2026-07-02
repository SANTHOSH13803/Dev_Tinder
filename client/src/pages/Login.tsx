import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../store/api/user/userApi.slice";
import { Formik, Form, type FormikProps, ErrorMessage } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
interface LoginFormValues {
  emailId: string;
  password: string;
}
const initialValues: LoginFormValues = {
  emailId: "",
  password: ""
};
export default function Login() {
  const navigate = useNavigate();
  const formRef = useRef<FormikProps<LoginFormValues>>(null);
  const handleNavigate = () => {
    navigate("/signUp");
  };
  const validationSchema = yup.object({
    emailId: yup.string().required("Email is Required"),
    password: yup.string().required("Password is required")
  });
  const [loginApi, { isLoading }] = useLoginUserMutation();
  const [tooglePassword, setTooglePassword] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const data = await loginApi({
        body: values
      }).unwrap();
      toast.success(`Welcome back ${data.data.firstName}`);
      navigate("/");
    } catch (error: any) {
      console.warn(error);
    }
  };
  const handleForgetPassword = () => {
    navigate("/forgot-password", {
      state: { emailId: formRef.current?.values?.emailId ?? "" }
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md border-border/60 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>

          <CardDescription>Sign in to continue to DevTinder.</CardDescription>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
            innerRef={formRef}
          >
            {({ values, handleChange, handleBlur, touched, errors }) => (
              <Form className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="emailId">Email</Label>

                  <Input
                    id="emailId"
                    name="emailId"
                    type="email"
                    placeholder="john@example.com"
                    value={values.emailId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      touched.emailId && errors.emailId
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />

                  <ErrorMessage
                    name="emailId"
                    component="p"
                    className="text-sm text-destructive"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={tooglePassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pr-10 ${
                        touched.password && errors.password
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setTooglePassword((prev) => !prev)}
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
                    >
                      {tooglePassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-sm text-destructive"
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="link"
                      type="button"
                      onClick={handleForgetPassword}
                      className="h-auto p-0 text-sm"
                    >
                      Forgot password?
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={handleNavigate}
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
