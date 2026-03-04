import React from "react";
import { NavLink, useLocation } from "react-router";

import {
  createPathWithTemplateId,
  getRememberedTemplateId,
} from "utils/templateMemory";

import HomeIcon from "assets/icons/home.svg?react";
import PerformIcon from "assets/icons/perform.svg?react";
import StatsIcon from "assets/icons/stats.svg?react";
import TemplateIcon from "assets/icons/template.svg?react";

type MobileNavItem = {
  key: "home" | "template" | "perform" | "stats";
  label: string;
  path: string;
  isActive: (pathname: string) => boolean;
  icon: React.ReactNode;
};

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const templatePageTemplateId = getRememberedTemplateId(
    "last-template-id:template",
  );
  const performPageTemplateId = getRememberedTemplateId(
    "last-template-id:perform",
  );
  const statsPageTemplateId = getRememberedTemplateId("last-template-id:stats");
  const templatePath = templatePageTemplateId
    ? `/templates/edit?templateId=${encodeURIComponent(templatePageTemplateId)}`
    : "/templates/create";

  const navItems: MobileNavItem[] = [
    {
      key: "home",
      label: "Главная",
      path: "/",
      isActive: (pathname) => pathname === "/",
      icon: <HomeIcon aria-hidden="true" className="size-5" />,
    },
    {
      key: "template",
      label: "Шаблон",
      path: templatePath,
      isActive: (pathname) => pathname.startsWith("/templates/"),
      icon: <TemplateIcon aria-hidden="true" className="size-5" />,
    },
    {
      key: "perform",
      label: "Выполнение",
      path: createPathWithTemplateId("/workout/perform", performPageTemplateId),
      isActive: (pathname) => pathname.startsWith("/workout/perform"),
      icon: <PerformIcon aria-hidden="true" className="size-5" />,
    },
    {
      key: "stats",
      label: "Статистика",
      path: createPathWithTemplateId("/stats", statsPageTemplateId),
      isActive: (pathname) => pathname.startsWith("/stats"),
      icon: <StatsIcon aria-hidden="true" className="size-5" />,
    },
  ];

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-5xl grid-cols-4 px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)]">
        {navItems.map((item) => {
          const isCurrentItem = item.isActive(location.pathname);

          return (
            <li key={item.key}>
              <NavLink
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-xs ${
                  isCurrentItem ? "text-black" : "text-neutral-500"
                }`}
                to={item.path}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
