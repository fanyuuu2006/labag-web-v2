import { RootRoute } from "@/libs/routes";
import { cn } from "@/utils/className";
import { CaretLeftOutlined } from "@ant-design/icons";
import { Collapse, DistributiveOmit, OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

type MobileLinkProps = OverrideProps<
  DistributiveOmit<React.ComponentProps<typeof Link>, "href" | "children">,
  {
    route: RootRoute;
  }
>;

export const MobileLink = ({
  route,
  className,
  onClick,
  ...rest
}: MobileLinkProps) => {
  const pathName = usePathname();
  const isActive =
    route.isActive?.(pathName) ?? pathName.startsWith(route.href);
  const hasSubRoute = route.subRoutes && route.subRoutes.length > 0;
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleToggleSubMenu = useCallback(() => {
    setIsSubMenuOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // 點擊連結時關閉選單
      setIsSubMenuOpen(false);
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between py-3 px-6 border-b border-(--border-color)">
        <Link
          href={route.href}
          className={cn(
            "text-nowrap font-semibold flex items-center justify-center gap-2 text-(--text-color-muted) transition-colors duration-300 hover:text-(--text-color-primary)",
            {
              "text-(--text-color-primary)": isActive,
            },
            className
          )}
          onClick={handleLinkClick}
          {...rest}
        >
          {route.icon && <route.icon className="text-[0.75em]" />}
          <span>{route.label}</span>
        </Link>

        {hasSubRoute && (
          <button
            onClick={handleToggleSubMenu}
            className={cn("p-1 text-(--text-color-muted)")}
            aria-label={isSubMenuOpen ? "關閉子選單" : "開啟子選單"}
            aria-expanded={isSubMenuOpen}
            aria-controls={`sub-menu-${route.href.replace("/", "")}`}
          >
            <CaretLeftOutlined
              className={cn("transition-transform duration-200", {
                "-rotate-90": isSubMenuOpen,
              })}
            />
          </button>
        )}
      </div>
      {/* 子選單區域 */}
      {hasSubRoute && (
        <Collapse
          state={isSubMenuOpen}
          className="slide-collapse"
          id={`sub-menu-${route.href.replace("/", "")}`}
        >
          <div className="flex flex-col text-[0.8em] p-1">
            {route.subRoutes!.map((sub) => {
              return (
                <Link
                  key={sub.href}
                  href={`${route.href}${sub.href}`}
                  onClick={handleLinkClick}
                  className="px-8 py-3 text-(--text-color-muted) flex items-center justify-center gap-2"
                >
                  {sub.icon && <sub.icon className="text-[0.75em]" />}
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </Collapse>
      )}
    </div>
  );
};
