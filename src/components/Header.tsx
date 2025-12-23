"use client";
import Link from "next/link";
import { MyImage } from "./MyImage";
import { routes } from "@/libs/routes";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/className";

const IS_ACTIVE = (path: string, href: string): boolean => {
  return path.startsWith(href);
};

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className="bg-black/50 backdrop-blur-2xl">
      <div className="container flex items-center py-4">
        <Link href="/" className="h-16">
          <MyImage
            src={"/images/Title.png"}
            className="w-auto h-full object-contain"
          />
        </Link>
        <nav className="ms-auto text-2xl font-bold flex items-center justify-end gap-4">
          {routes.map((route) => {
            const isActive =
              route.isActive ?? ((path: string) => IS_ACTIVE(path, route.href));
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn("text-nowrap", {
                  "text-(--text-color-primary)": isActive(pathname),
                })}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
