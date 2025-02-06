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

    return NextResponse.json({
      applications,
    });
  } catch (error) {
    console.error("[GET_APPLICATIONS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
