import { JSX, ReactNode } from "react";
import {
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
  { icon: <LuUser />, label: "UID:", value: "30032211411UI" },
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
    name: "Főoldal",
    link: "/dashboard",
    icon: <LuHouse size={22} />,
  },
  {
    name: "Galéria",
    link: "/dashboard/gallery",
    icon: <LuGalleryThumbnails size={22} />,
  },
];
//#endregion
