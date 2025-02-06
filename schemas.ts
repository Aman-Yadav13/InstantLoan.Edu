import * as z from "zod";

const applicantSchema = z.object({
  userDetails: z.object({
    applicantFirstName: z.string().nonempty("First name is required"),
    applicantLastName: z.string().nonempty("Last name is required"),
    purpose: z.string().nonempty("Purpose is required"),
    amountRequested: z.string().nonempty("Amount requested is required"),
    dob: z
      .date({
        required_error: "A date of birth is required.",
      })
      .optional(),
  }),

  familyDetails: z.object({
    fatherFirstName: z.string().nonempty("Father's first name is required"),
    fatherLastName: z.string().nonempty("Father's last name is required"),
    fatherOccupation: z.string().nonempty("Father's occupation is required"),
    fatherIncome: z.string().nonempty("Father's income is required"),

    motherFirstName: z.string().nonempty("Mother's first name is required"),
    motherLastName: z.string().nonempty("Mother's last name is required"),
    motherOccupation: z.string().optional(),
    motherIncome: z.string().optional(),
  }),

  documents: z
    .object({
      aadharCard: z
        .instanceof(File)
        .refine((file) => file?.size > 0, "Aadhar card file is required"),
      marksheet10th: z
        .instanceof(File)
        .refine((file) => file?.size > 0, "10th marksheet file is required"),
      marksheet12th: z
        .instanceof(File)
        .refine((file) => file?.size > 0, "12th marksheet file is required"),
      rationCard: z
        .instanceof(File)
        .optional()
        .refine(
          (file) => !file || file.size > 0,
          "Ration card file is required if provided"
        ),
      proofOfIncome: z
        .instanceof(File)
        .optional()
        .refine(
          (file) => !file || file.size > 0,
          "Proof of income file is required if provided"
        ),
    })
    .refine((data) => !data.rationCard || data.proofOfIncome, {
      message: "Proof of income is required if ration card is provided",
      path: ["proofOfIncome"],
    }),
});

export { applicantSchema };
