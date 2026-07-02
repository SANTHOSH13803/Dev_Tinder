import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useForgetPasswordMutation } from "@/store/api/user/userApi.slice";

const forgotPasswordSchema = z.object({
  emailId: z.email("Enter a valid email address").min(1, "Email is required")
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailId: location?.state?.emailId ?? ""
    }
  });

  const [forgotPasswordApi] = useForgetPasswordMutation();

  const onSubmit = async (values: ForgotPasswordForm) => {
    try {
      const response = await forgotPasswordApi({
        emailId: values.emailId
      }).unwrap();

      if (response.success) {
        const RESEND_TIME = 60 * 1000;
        const resendAt = Date.now() + RESEND_TIME;
        localStorage.setItem("resendAt", resendAt.toString());
        navigate("/email-sent", {
          state: {
            emailId: values.emailId
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>

          <CardDescription>
            Enter your registered email and we'll send you a password reset
            link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emailId">Email</Label>

              <Input
                id="emailId"
                type="email"
                placeholder="john@example.com"
                {...register("emailId")}
              />

              {errors.emailId && (
                <p className="text-sm text-destructive">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
