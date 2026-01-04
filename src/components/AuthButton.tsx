"use client";
import { cn } from "@/utils/className";
import { useUser } from "@/contexts/UserContext";

type AuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export const AuthButton = ({ className, ...rest }: AuthButtonProps) => {
  const { user, logOut, logIn } = useUser();
  const handleAuthClick = () => {
    if (user) {
      logOut();
    } else {
      logIn("google");
    }
  };

  return (
    <button onClick={handleAuthClick} className={cn(className)} {...rest}>
      {user ? "登出" : "登入"}
    </button>
  );
};
