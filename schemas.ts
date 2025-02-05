import { z } from "zod";

const applicantSchema = z.object({
  userDetails: z.object({
    applicantFirstName: z.string().nonempty("First name is required"),
    applicantLastName: z.string().nonempty("Last name is required"),
    purpose: z.string().nonempty("Purpose is required"),
    amountRequested: z.number().positive("Amount must be positive"),
    dob: z.string().nonempty("Date of birth is required"),
  }),

  familyDetails: z.object({
    fatherFirstName: z.string().nonempty("Father's first name is required"),
    fatherLastName: z.string().nonempty("Father's last name is required"),
    fatherOccupation: z.string().nonempty("Father's occupation is required"),
    fatherIncome: z.number().min(0, "Income must be a positive number"),

    motherFirstName: z.string().nonempty("Mother's first name is required"),
    motherLastName: z.string().nonempty("Mother's last name is required"),
    motherOccupation: z.string().optional(),
    motherIncome: z.number().min(0).optional(),

    guardianFirstName: z.string().optional(),
    guardianLastName: z.string().optional(),
    guardianOccupation: z.string().optional(),
  }),

  documents: z
    .object({
      aadharCard: z.string().nonempty("Aadhar card is required"),
      marksheet10th: z.string().nonempty("10th marksheet is required"),
      marksheet12th: z.string().nonempty("12th marksheet is required"),
      rationCard: z.string().optional(),
      proofOfIncome: z.string().optional(),
    })
    .refine(
      (data) => {
        // Conditional document validation
        const isRationCardProvided = !!data.rationCard;
        const isProofOfIncomeProvided = !!data.proofOfIncome;
        return !isRationCardProvided || isProofOfIncomeProvided;
      },
      {
        message: "Proof of income is required if ration card is provided",
        path: ["proofOfIncome"],
      }
    ),
});

export default applicantSchema;
