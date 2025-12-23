export const routes: {
    label: string;
    href: string;
    isActive?: (path: string) => boolean;
}[] = [
    {
        label: "首頁",
        href: "/",
        isActive: (path: string) => path === "/",
    },
    {
        label: "排行榜",
        href: "/rankings",
    }
]