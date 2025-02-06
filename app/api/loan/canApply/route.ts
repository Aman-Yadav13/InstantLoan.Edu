import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      console.error("[GET_APPLICATIONS] User profile not found");
      return new NextResponse("User profile not found", { status: 400 });
    }

    const applications = await db.loanApplication.findMany({
      where: {
        profileId: profile.id,
      },
    });

    const canApply =
      applications.length === 0
        ? true
        : applications.every(
            (application) => application.status === "rejected"
          );

    return NextResponse.json({
      canApply,
    });
  } catch (error) {
    console.error("[GET_CAN_APPLY]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
