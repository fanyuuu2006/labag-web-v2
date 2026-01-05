import { RootRoute } from "@/libs/routes";
import { cn } from "@/utils/className";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DesktopLinkProps = OverrideProps<
  DistributiveOmit<React.ComponentProps<typeof Link>, "href" | "children">,
  {
    route: RootRoute;
  }
>;

export const DesktopLink = ({
  route,
  className,
  ...rest
}: DesktopLinkProps) => {
  const pathName = usePathname();
  const isActive =
    route.isActive?.(pathName) ?? pathName.startsWith(route.href);
  const isSubActive = route.subRoutes?.some((sub) => pathName === sub.href);

  return (
    <div className="group relative flex items-center justify-center">
      <Link
        href={route.href}
        className={cn(
          "text-nowrap font-semibold flex items-center justify-center gap-2 text-(--text-color-muted) transition-colors duration-300 hover:text-(--text-color-primary)",
          {
            "text-(--text-color-primary)": isActive || isSubActive,
          },
          className
        )}
        {...rest}
      >
        {route.icon && <route.icon className="text-[0.75em]" />}
        <span>{route.label}</span>
      </Link>
      {route.subRoutes && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 hidden group-hover:block w-max z-50">
          <div className="text-[0.8em] card-secondary flex flex-col overflow-hidden p-1">
            {route.subRoutes.map((subRoute) => {
              return (
                <Link
                  key={subRoute.href}
                  href={`${route.href}${subRoute.href}`}
                  className={cn(
                    "px-4 py-2 text-nowrap flex items-center justify-center gap-2 text-(--text-color-muted) hover:text-(--text-color-primary) transition-colors duration-300"
                  )}
                >
                  {subRoute.icon && <subRoute.icon className="text-[0.75em]" />}
                  {subRoute.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
