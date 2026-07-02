import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useForgetPasswordMutation } from "@/store/api/user/userApi.slice";
import { MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmailSentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendAt, setResendAt] = useState<number | null>(() => {
    const stored = localStorage.getItem("resendAt");
    return stored ? Number(stored) : null;
  });
  useEffect(() => {
    if (!resendAt) return;

    const interval = setInterval(() => {
      const remaining = resendAt - Date.now();

      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem("resendAt");
        setResendAt(null);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resendAt]);
  if (!location.state?.emailId) {
    return <Navigate to={"/login"} replace={true} />;
  }
  const [forgotPasswordApi, { isLoading }] = useForgetPasswordMutation();

  const handleResend = async () => {
    const respone = await forgotPasswordApi({
      emailId: location.state.emailId
    }).unwrap();
    if (respone.success) {
      const resendAtTime = Date.now() + 60 * 1000;
      localStorage.setItem("resendAt", resendAtTime.toString());
      toast.info("Email Sent succefully!!");
      setResendAt(resendAtTime);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <MailCheck className="h-8 w-8 text-green-600" />
          </div>

          <CardTitle className="mt-4">Check your email</CardTitle>

          <CardDescription>We've sent a password reset link to</CardDescription>

          <p className="font-semibold">{location.state.emailId}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            disabled={timeLeft > 0 || isLoading}
            onClick={handleResend}
            type="button"
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Email"}
          </Button>
          <Button
            variant="link"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSentPage;
