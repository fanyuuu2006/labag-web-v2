"use client";
import Link from "next/link";
import { routes } from "@/libs/routes";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/className";
import { GlowText } from "../GlowText";
import { Burger } from "./Burger";
import { useState, useCallback } from "react";
import { Collapse } from "fanyucomponents";

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
  const isActive = isRouteActive(pathname, route.href, route.isActive);
  const Icon = route.icon;

  return (
    <Link
      href={route.href}
      onClick={onClick}
      className={cn(
        "text-nowrap font-semibold flex items-center justify-center gap-2 text-(--text-color-muted) transition-colors duration-300",
        isActive && "text-(--text-color-primary)",
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
      <div className="container flex items-center justify-between">
        <Link href="/" onClick={closeMenu}>
          <GlowText
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
            aria-controls="mobile-nav"
          />
        </div>

        <nav className="hidden lg:flex text-3xl items-center gap-2 md:gap-4">
          {routes.map((route) => (
            <NavLink key={route.href} route={route} pathname={pathname} />
          ))}
        </nav>
      </div>
      <Collapse
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
        </div>
      </Collapse>
    </header>
  );
};
