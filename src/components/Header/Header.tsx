"use client";
import Link from "next/link";
import { routes } from "@/libs/routes";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/className";
import { GlowText } from "../GlowText";
import { Burger } from "./Burger";
import { useState, useCallback } from "react";
import { Collapse } from "fanyucomponents";
import { useUser } from "@/contexts/UserContext";
import { AuthButton } from "../AuthButton";

// 判斷路由是否激活的輔助函式
const isRouteActive = (
  pathname: string,
  href: string,
  customActiveCheck?: (path: string) => boolean
): boolean => {
  if (customActiveCheck) return customActiveCheck(pathname);
  return pathname.startsWith(href);
};

// 提取 NavLink 組件以減少重複代碼
interface NavLinkProps {
  route: (typeof routes)[number];
  pathname: string;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ route, pathname, onClick, className }: NavLinkProps) => {
  const { user } = useUser();
  const isActive = isRouteActive(pathname, route.href, route.isActive);
  const Icon = route.icon;

  if (route.needsAuth && !user) {
    return null;
  }

  return (
    <Link
      href={route.href}
      onClick={onClick}
      className={cn(
        "text-nowrap font-semibold flex items-center justify-center gap-2 text-(--text-color-muted) transition-colors duration-300 hover:text-(--text-color-primary)",
        {
          "text-(--text-color-primary)": isActive,
        },
        className
      )}
    >
      <Icon className="text-[0.75em]" />
      <span>{route.label}</span>
    </Link>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const [menuShow, setMenuShow] = useState<boolean>(false);

  const handleMenuToggle = useCallback(() => {
    setMenuShow((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuShow(false);
  }, []);

  return (
    <header className="w-full flex flex-col border-b border-(--border-color) bg-black/25 backdrop-blur-md transition-all">
      <div className="container flex items-center justify-between py-4 px-6">
        <Link href="/" onClick={closeMenu}>
          <GlowText
            role="banner"
            as="h1"
            className="font-bold tracking-wider text-nowrap text-5xl"
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
            aria-controls="desktop-nav"
          />
        </div>

        <nav className="hidden lg:flex text-3xl items-center gap-2 md:gap-4">
          {routes.map((route) => (
            <NavLink key={route.href} route={route} pathname={pathname} />
          ))}
          <div className="p-2 flex items-center justify-center">
            <AuthButton className="text-[0.75em] font-bold" />
          </div>
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
            <NavLink
              key={route.href}
              route={route}
              pathname={pathname}
              onClick={closeMenu}
              className="p-2"
            />
          ))}
          <div className="p-2 flex items-center justify-center">
            <AuthButton className="text-[0.75em] font-bold" />
          </div>
        </div>
      </Collapse>
    </header>
  );
};
