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

export const DesktopLink = ({ route, className }: DesktopLinkProps) => {
  const pathName = usePathname();
  const isActive = route.isActive?.(pathName) || pathName === route.href;
  const Icon = route.icon;

  return (
    <Link
      href={route.href}
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
