import { Navbar } from "@/components/navbar";
import { initialProfile } from "@/lib/initial-profile";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await initialProfile();

  return (
    <div className="h-full w-full">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
