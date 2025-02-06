import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DocumentType } from "@prisma/client";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile || !profile.userId) {
      console.error("User profile not found or missing userId");
      return new NextResponse("User profile not found", { status: 400 });
    }

    const formData = await req.formData();
    const userDetails = JSON.parse(formData.get("userDetails") as string);
    const familyDetails = JSON.parse(formData.get("familyDetails") as string);

    const uploadedFiles = [];

    const documentKeys = [
      "documents.aadharCard",
      "documents.marksheet10th",
      "documents.marksheet12th",
      "documents.rationCard",
      "documents.proofOfIncome",
    ];

    for (const key of documentKeys) {
      const file = formData.get(key) as File | null;
      if (file && file.size > 0) {
        try {
          const fileBuffer = await file.arrayBuffer();
          const documentType = key.replace("documents.", "");
          const fileKey = `${profile.userId}/${documentType}/${file.name}`;

          const uploadResult = await s3
            .upload({
              Bucket: process.env.AWS_S3_BUCKET_NAME!,
              Key: fileKey,
              Body: Buffer.from(fileBuffer),
              ContentType: file.type,
            })
            .promise();

          uploadedFiles.push({ key: documentType, url: uploadResult.Location });

          await db.document.create({
            data: {
              profileId: profile.id,
              documentType: documentType.toUpperCase() as DocumentType,
              documentUrl: uploadResult.Location,
              status: "uploaded",
            },
          });
        } catch (uploadError) {
          console.error(`Error uploading ${key}:`, uploadError);
        }
      } else {
        console.warn(`No file found or empty file for key: ${key}`);
      }
    }

    await db.family.upsert({
      where: { profileId: profile.id },
      update: {
        fatherFirstName: familyDetails.fatherFirstName,
        fatherLastName: familyDetails.fatherLastName,
        motherFirstName: familyDetails.motherFirstName,
        motherLastName: familyDetails.motherLastName,
        fatherOccupation: familyDetails.fatherOccupation,
        motherOccupation: familyDetails.motherOccupation || null,
        fatherIncome: parseInt(familyDetails.fatherIncome),
        motherIncome: parseInt(familyDetails.motherIncome || "0"),
      },
      create: {
        profileId: profile.id,
        fatherFirstName: familyDetails.fatherFirstName,
        fatherLastName: familyDetails.fatherLastName,
        motherFirstName: familyDetails.motherFirstName,
        motherLastName: familyDetails.motherLastName,
        fatherOccupation: familyDetails.fatherOccupation,
        motherOccupation: familyDetails.motherOccupation || null,
        fatherIncome: parseInt(familyDetails.fatherIncome),
        motherIncome: parseInt(familyDetails.motherIncome || "0"),
      },
    });

    const loanApplication = await db.loanApplication.create({
      data: {
        profileId: profile.id,
        amountRequested: parseInt(userDetails.amountRequested),
        purpose: userDetails.purpose,
        status: "pending",
      },
    });
    console.log(
      "Data Uploaded Successfully",
      userDetails,
      uploadedFiles,
      loanApplication
    );

    return NextResponse.json({
      message: "Data and documents uploaded successfully.",
      files: uploadedFiles,
      loanApplicationId: loanApplication.id,
    });
  } catch (error) {
    console.error("[UPLOAD_DETAILS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
