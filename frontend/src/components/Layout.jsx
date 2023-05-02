import React from "react";
import { Outlet } from "react-router-dom";
import HelpButton from "./HelpButton";

export const Layout = () => {
  return (
    <div>
      <HelpButton />
      <Outlet />
    </div>
  );
};
