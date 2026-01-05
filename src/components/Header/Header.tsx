"use client";
import Link from "next/link";
import { routes } from "@/libs/routes";
import { GlowText } from "../GlowText";
import { Burger } from "./Burger";
import { useState, useCallback } from "react";
import { Collapse } from "fanyucomponents";
import { DesktopLink } from "./DesktopLink";
import { MobileLink } from "./MobileLink";

export const Header = () => {
  const [menuShow, setMenuShow] = useState<boolean>(false);

  const handleMenuToggle = useCallback(() => {
    setMenuShow((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuShow(false);
  }, []);

  return (
    <header className="relative z-50 w-full flex flex-col border-b border-(--border-color) bg-black/25 backdrop-blur-md transition-all">
      <div className="container flex items-center justify-between p-6">
        <Link href="/" onClick={closeMenu}>
          <GlowText
            role="banner"
            as="h1"
            className="font-bold tracking-wider text-nowrap text-5xl"
          >
            啦八機
          </GlowText>
        </Link>

        <div className="text-xl lg:hidden">
          <Burger
            checked={menuShow}
            onChange={handleMenuToggle}
            aria-label={menuShow ? "關閉選單" : "開啟選單"}
            aria-expanded={menuShow}
            aria-controls="desktop-nav"
          />
        </div>

        <nav className="hidden lg:flex text-3xl items-center gap-2 md:gap-4">
          {routes.map((route) => (
            <DesktopLink key={route.href} route={route} className="px-2 py-1" />
          ))}
        </nav>
      </div>
      <Collapse
        as="nav"
        state={menuShow}
        className="slide-collapse lg:hidden"
        id="mobile-nav"
      >
        <div className="flex flex-col w-full text-2xl">
          {routes.map((route) => (
            <MobileLink
              key={route.href}
              onClick={closeMenu}
              route={route}
              className="py-2"
            />
          ))}
        </div>
      </Collapse>
    </header>
  );
};
