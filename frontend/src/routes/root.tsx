import { Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function Root() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
