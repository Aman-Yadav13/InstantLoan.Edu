import { Button } from "@/components/ui/button";

const HomePage = async () => {
  return (
    <div className="w-full" style={{ height: "calc(100vh - 45px)" }}>
      <div className="h-full w-full grid grid-cols-2 overflow-hidden">
        <div className="col-span-1 h-full bg-sky-50">
          <div className="h-full w-full flex justify-center">
            <div className="flex flex-col items-center max-w-[68%] gap-1 mt-[30%]">
              <p className="text-emerald-800 text-3xl text-start">
                Empowering Dreams with Seamless Loan Approvals
              </p>
              <p className="text-emerald-700 text-sm">
                Making education accessible for every student, especially the
                underprivileged, through a transparent and efficient loan
                application process.
              </p>
              <button className="rounded-md self-start mt-4 text-white bg-indigo-600 px-4 py-[8px] flex items-center justify-center hover:bg-indigo-700 transition-all duration-100">
                Get started
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-1 object-cover relative">
          <img
            src={"/landing_image.jpg"}
            className="h-full w-full object-cover"
          />
          <div className="z-[10] bg-gray-900/30 absolute inset-0" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
