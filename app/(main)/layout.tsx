import { Navbar } from "@/components/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
