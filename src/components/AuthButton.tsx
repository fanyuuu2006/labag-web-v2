"use client";
import { cn } from "@/utils/className";
import { useUser } from "@/contexts/UserContext";
import { OverrideProps } from "fanyucomponents";
import { useCallback } from "react";
import { SignBy } from "@/types/backend";

type AuthButtonProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | {
      type?: "login";
      signBy: SignBy;
    }
  | {
      type: "logout";
      signBy?: never;
    }
>;

export const AuthButton = ({
  className,
  children,
  signBy,
  type,
  disabled,
  ...rest
}: AuthButtonProps) => {
  const { user, logOut, logIn, loading } = useUser();

  const handleAuthClick = useCallback(() => {
    if (type === "logout") {
      logOut();
      return;
    }

    if (type === "login") {
      logIn(signBy);
      return;
    }

    if (user) {
      logOut();
    } else {
      logIn(signBy);
    }
  }, [logIn, logOut, signBy, type, user]);

  return (
    <button
      onClick={handleAuthClick}
      className={cn(className)}
      disabled={loading || disabled}
      {...rest}
    >
      {children || (user ? "登出" : "登入")}
    </button>
  );
};
