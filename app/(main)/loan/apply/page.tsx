"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import applicantSchema from "@/schemas";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const LoanApplicationPage = () => {
  const [currentStage, setCurrentStage] = useState(0);

  const form = useForm<z.infer<typeof applicantSchema>>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      userDetails: {
        applicantFirstName: "",
        applicantLastName: "",
        purpose: "",
        amountRequested: 0,
        dob: "",
      },
      familyDetails: {
        fatherFirstName: "",
        fatherLastName: "",
        fatherOccupation: "",
        fatherIncome: 0,
        motherFirstName: "",
        motherLastName: "",
        motherOccupation: "",
        motherIncome: 0,
        guardianFirstName: "",
        guardianLastName: "",
        guardianOccupation: "",
      },
      documents: {
        aadharCard: "",
        marksheet10th: "",
        marksheet12th: "",
        rationCard: "",
        proofOfIncome: "",
      },
    },
  });

  const stepOneSubmit = (data: z.infer<typeof applicantSchema>) => {
    console.log(data);
    setCurrentStage(2);
  };

  return (
    <div className="h-full w-full flex justify-center">
      <div className="w-[80%] h-fit bg-gray-50/50 mt-8 border border-gray-200 rounded-sm shadow-md">
        <div className="mt-6 w-full flex items-center justify-center gap-[15%]">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center h-9 w-9  rounded-full font-semibold border",
                currentStage >= 1
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-gray-300 text-gray-800 border-gray-400"
              )}
            >
              1
            </div>
            <p
              className={cn(
                "font-semibold text-gray-700 text-sm",
                currentStage >= 1 ? "text-green-800" : "text-gray-700"
              )}
            >
              Loan Details
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center h-9 w-9  rounded-full font-semibold border",
                currentStage >= 2
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-gray-300 text-gray-800 border-gray-400"
              )}
            >
              2
            </div>
            <p
              className={cn(
                "font-semibold text-gray-700 text-sm",
                currentStage >= 2 ? "text-green-800" : "text-gray-700"
              )}
            >
              Family details
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center h-9 w-9  rounded-full font-semibold border",
                currentStage >= 3
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-gray-300 text-gray-800 border-gray-400"
              )}
            >
              3
            </div>
            <p
              className={cn(
                "font-semibold text-gray-700 text-sm",
                currentStage >= 3 ? "text-green-800" : "text-gray-700"
              )}
            >
              Upload Documents
            </p>
          </div>
        </div>
        <hr className="w-full mt-4" />
        <div className="h-full w-full px-4 py-4">
          {currentStage === 0 && (
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(stepOneSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="userDetails.applicantFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicant Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter applicant name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This must match the name on your documents
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          )}
          {currentStage === 2 && <div></div>}
          {currentStage === 3 && <div></div>}
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationPage;
