"use client";
import Link from "next/link";
import { routes } from "@/libs/routes";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/className";
import { GlowText } from "../GlowText";
import { Burger } from "./Burger";
import { useState, useCallback } from "react";
import { Collapse } from "fanyucomponents";

const IS_ACTIVE = (path: string, href: string): boolean => {
  return path.startsWith(href);
};

export const Header = () => {
  const pathname = usePathname();
  const [menuShow, setMenuShow] = useState<boolean>(false);

  const handleMenuToggle = useCallback(() => {
    setMenuShow((prev) => !prev);
  }, []);

  return (
    <header className="w-full flex flex-col border-b border-(--border-color) bg-black/45 backdrop-blur-md transition-all">
      <div className="container flex  items-center justify-between">
        <Link
          href="/"
          onClick={() => {
            setMenuShow(false);
          }}
        >
          <GlowText
            as="h1"
            className="font-bold tracking-wider text-nowrap text-4xl"
          >
            啦八機
          </GlowText>
        </Link>

        <div className="text-2xl lg:hidden">
          <Burger
            checked={menuShow}
            onChange={handleMenuToggle}
            aria-label={menuShow ? "關閉選單" : "開啟選單"}
            aria-expanded={menuShow}
            aria-controls="mobile-nav"
          />
        </div>

        <nav className="hidden lg:flex text-3xl items-center gap-2 md:gap-4">
          {routes.map((route) => {
            const isActive = route.isActive
              ? route.isActive(pathname)
              : IS_ACTIVE(pathname, route.href);

            const Icon = route.icon;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-nowrap flex items-center gap-2 text-(--text-color-muted) transition-colors duration-300",
                  {
                    "text-(--text-color-primary)": isActive,
                  }
                )}
              >
                <Icon className="text-[0.75em]" />
                <span>{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <Collapse
        state={menuShow}
        className="slide-collapse lg:hidden"
        id="mobile-nav"
      >
        <div className="flex flex-col w-full text-xl font-semibold">
          {routes.map((route) => {
            const isActive = route.isActive
              ? route.isActive(pathname)
              : IS_ACTIVE(pathname, route.href);

            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => {
                  setMenuShow(false);
                }}
                className={cn(
                  "text-nowrap p-2 flex items-center justify-center text-(--text-color-muted) transition-colors duration-300",
                  {
                    "text-(--text-color-primary)": isActive,
                  }
                )}
              >
                <Icon className="text-[0.75em]" />
                <span>{route.label}</span>
              </Link>
            );
          })}
        </div>
      </Collapse>
    </header>
  );
};
