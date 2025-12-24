"use client";
import Link from "next/link";
import { routes } from "@/libs/routes";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/className";
import { GlowText } from "./GlowText";

const IS_ACTIVE = (path: string, href: string): boolean => {
  return path.startsWith(href);
};

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-black/30 backdrop-blur-2xl">
      <div className="container flex items-center">
        <Link href="/">
          <GlowText as="h1" className="text-5xl text-nowrap font-bold">
            啦八機
          </GlowText>
        </Link>
        <nav className="ms-auto text-2xl font-bold flex items-center justify-end gap-4">
          {routes.map((route) => {
            const isActive =
              route.isActive ?? ((path: string) => IS_ACTIVE(path, route.href));
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn("text-nowrap hover:underline", {
                  "text-(--text-color-primary)": isActive(pathname),
                })}
              >
                <route.icon/> {route.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
