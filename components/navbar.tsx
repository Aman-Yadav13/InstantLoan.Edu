"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  const router = useRouter();

  const handleGoToHome = () => {
    router.push("/");
  };

  return (
    <div className="h-[45px] border-b border-b-gray-300 px-2 py-1 bg-indigo-900">
      <div className="flex items-center justify-between h-full">
        <div className="h-[20px]">
          <Image
            src={"/iledu.png"}
            alt="Instant Loan"
            className="h-full cursor-pointer"
            width="200"
            height="10"
            onClick={handleGoToHome}
          />
        </div>
        <div className="flex items-center gap-2 h-full">
          <Button
            className="h-[34px] px-4 text-slate-700"
            variant="outline"
            asChild
          >
            <Link href={"/loan/apply"}>Apply</Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
