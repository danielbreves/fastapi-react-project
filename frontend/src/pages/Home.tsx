import ManageTasks from "../components/tasks/ManageTasks";
import MainLayout from "../layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <ManageTasks projectId={34} />
    </MainLayout>
  );
}
