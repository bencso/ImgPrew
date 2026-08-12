import { JSX, ReactNode } from "react";
import {
  LuBookText,
  LuGalleryThumbnails,
  LuHistory,
  LuHouse,
  LuUser,
} from "react-icons/lu";

//#region Debuf Infók
interface AppInfoBlock {
  icon: JSX.Element;
  label: string;
  value: string;
}

export const appInfos: AppInfoBlock[] = [
  { icon: <LuHistory />, label: "Verziószám", value: "0.01" },
];
//#endregion

//#region Linkek
export interface LinkType {
  name?: string;
  link?: string;
  icon?: ReactNode;
}

export const links: LinkType[] = [
  {
    name: "Főőodal",
    link: "/",
    icon: <LuHouse size={22} />,
  },
  {
    name: "Leírás",
    link: "/docs",
    icon: <LuBookText size={22} />,
  },
];
//#endregion
