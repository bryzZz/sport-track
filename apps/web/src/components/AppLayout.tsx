import React from "react";
import { Outlet } from "react-router";

import { MobileBottomNav } from "components/MobileBottomNav";

export const AppLayout: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-24 md:pb-8">
      <Outlet />
      <MobileBottomNav />
    </div>
  );
};
