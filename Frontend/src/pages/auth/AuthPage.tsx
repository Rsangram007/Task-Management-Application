import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { useAuth } from "../../hooks/useAuth";
 
export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      await signUp(email, password, name);
      toast.success("Registration successful! Please sign in.");
      setIsSignIn(true);
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      
    >
      <div className="max-w-md w-full space-y-8">
        <Toaster position="top-center" reverseOrder={false} />
        {isSignIn ? (
          <SignInForm
            onSignIn={handleSignIn}
            onSwitchToSignUp={() => setIsSignIn(false)}
          />
        ) : (
          <SignUpForm
            onSignUp={handleSignUp}
            onSwitchToSignIn={() => setIsSignIn(true)}
          />
        )}
      </div>
    </div>
  );
}
