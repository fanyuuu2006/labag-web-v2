"use client";
import Link from "next/link";
import { MyImage } from "./MyImage";
import { routes } from "@/libs/routes";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/className";
import { useModes } from "@/contexts/ModesContext";

const IS_ACTIVE = (path: string, href: string): boolean => {
  return path.startsWith(href);
};

export const Header = () => {
  const pathname = usePathname();
  const { modes } = useModes();
  const logo =
    {
      normal: "/images/Title.png",
      superhhh: "/images/SuperTitle.png",
      greenwei: "/images/GreenTitle.png",
      pikachu: "/images/KachuTitle.png",
    }[modes[0].name] || "/images/Title.png";

  return (
    <header className="bg-black/30 backdrop-blur-2xl">
      <div className="container flex items-center py-4">
        <Link href="/" className="h-16">
          <MyImage src={logo} className="w-auto h-full object-contain" />
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
