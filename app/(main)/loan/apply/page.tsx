"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { applicantSchema } from "@/schemas";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { occupations } from "@/data";
import { useToast } from "@/hooks/use-toast";

const LoanApplicationPage = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [canApply, setCanApply] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof applicantSchema>>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      userDetails: {
        applicantFirstName: "",
        applicantLastName: "",
        purpose: "",
        amountRequested: "",
        dob: undefined,
      },
      familyDetails: {
        fatherFirstName: "",
        fatherLastName: "",
        fatherOccupation: "",
        fatherIncome: "",
        motherFirstName: "",
        motherLastName: "",
        motherOccupation: "",
        motherIncome: "",
      },
      documents: {
        aadharCard: undefined,
        marksheet10th: undefined,
        marksheet12th: undefined,
        rationCard: undefined,
        proofOfIncome: undefined,
      },
    },
  });

  const stepOneSubmit = () => {
    setCurrentStage(1);
  };

  const stepTwoSubmit = () => {
    setCurrentStage(2);
  };

  const stepThreeSubmit = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append(
        "userDetails",
        JSON.stringify(form.getValues("userDetails"))
      );
      formData.append(
        "familyDetails",
        JSON.stringify(form.getValues("familyDetails"))
      );

      const documents = form.getValues("documents");
      Object.entries(documents).forEach(([key, file]) => {
        if (file instanceof File) {
          formData.append(`documents.${key}`, file);
        }
      });
      console.log("Form data: ", formData);
      const response = await axios.post("/api/loan/uploadDetails", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Application submitted",
        description:
          "Your application has been submitted successfully. Please wait while we verify your details.",
      });
      form.reset();
    } catch (error) {
      console.error("Error uploading details:", error);
      toast({
        title: "Error submitting application",
        description:
          "There was an error while submitting your application. Please try again later.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const goBack = () => {
    if (currentStage != 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const getIfCanApply = useCallback(async () => {
    try {
      const resp = await axios.get("/api/loan/canApply");
      setCanApply(resp.data.canApply);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getIfCanApply();
  }, [getIfCanApply]);

  return (
    <>
      {!canApply ? (
        <div className="px-12 flex w-full justify-center">
          <div className="mt-6 flex items-center justify-center px-4 w-fit bg-red-100 rounded-md py-2">
            <p className="text-red-600 text-lg">
              You already have a pending applications. Wait before you can apply
              for another loan. <br />
              <span className="text-center text-sm">
                You can track the status from the applications tab.
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex justify-center">
          <div
            className="w-[80%] bg-gray-50/50 mt-8 border border-gray-200 rounded-sm shadow-md h-fit flex flex-col gap-0"
            style={{ minHeight: `calc(100% - 100px)` }}
          >
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
            <div className="h-full w-full px-4 py-4 flex-1 flex">
              {currentStage === 0 && (
                <div className="flex-1">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(stepOneSubmit)}
                      className="space-y-8"
                    >
                      <div className="flex gap-4 w-full">
                        <FormField
                          control={form.control}
                          name="userDetails.applicantFirstName"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-gray-700">
                                First Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter applicant first name"
                                  {...field}
                                  className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                                  disabled={isUploading}
                                />
                              </FormControl>
                              <FormDescription>
                                This must match the name on your documents
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="userDetails.applicantLastName"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-gray-700">
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter applicant last name"
                                  {...field}
                                  className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                                  disabled={isUploading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex w-full items-start gap-12">
                        <FormField
                          control={form.control}
                          name="userDetails.dob"
                          disabled={isUploading}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-gray-700">
                                Date of birth
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    className="text-gray-700"
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Your date of birth is used to calculate your
                                age.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="userDetails.amountRequested"
                          render={({ field }) => (
                            <FormItem className="-mt-2">
                              <FormLabel className="text-gray-700">
                                Loan Amount
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter amount"
                                  {...field}
                                  className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400 min-w-[300px]"
                                  disabled={isUploading}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="userDetails.purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">
                                Purpose of loan
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explain your need for loan requirement"
                                  className="resize-none min-h-[200px] text-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                                  {...field}
                                  rows={6}
                                  disabled={isUploading}
                                />
                              </FormControl>
                              <FormDescription>
                                This will help us understand your needs better
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full justify-end flex items-center">
                        <Button
                          className="bg-indigo-600 hover:bg-indigo-700 px-4 !py-[2px]"
                          type="button"
                          onClick={stepOneSubmit}
                        >
                          Next
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
              {currentStage === 1 && (
                <div className="flex-1">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(stepTwoSubmit)}
                      className="space-y-4 relative h-full"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-800 text-xl">Father Details</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-4 w-full">
                            <FormField
                              control={form.control}
                              name="familyDetails.fatherFirstName"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-gray-700">
                                    First Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter father's first name"
                                      {...field}
                                      className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                                      disabled={isUploading}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Make sure the name you provide is consistent
                                    with documents you will provide.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="familyDetails.fatherLastName"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-gray-700">
                                    Last Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter father's last name"
                                      {...field}
                                      className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                                      disabled={isUploading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex gap-4 w-full">
                            <FormField
                              control={form.control}
                              name="familyDetails.fatherOccupation"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-gray-700">
                                    Occupation
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={occupations[0]}
                                    value={field.value}
                                    disabled={isUploading}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder="Select your father's occupation"
                                          className="flex-1"
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="h-[250px]">
                                      {occupations.map((occupation) => (
                                        <SelectItem
                                          key={occupation}
                                          value={occupation}
                                        >
                                          {occupation}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                    <FormDescription>
                                      Select your father's occupation from the
                                      list
                                    </FormDescription>
                                    <FormMessage />
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="familyDetails.fatherIncome"
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormLabel className="text-gray-700">
                                    Father Income
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isUploading}
                                      placeholder="Enter your father's income"
                                      {...field}
                                      className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400 min-w-[300px]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-800 text-xl">Mother Details</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-4 w-full">
                            <FormField
                              control={form.control}
                              name="familyDetails.motherFirstName"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-gray-700">
                                    Mother Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isUploading}
                                      placeholder="Enter father's first name"
                                      {...field}
                                      className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Make sure the name you provide is consistent
                                    with documents you will provide.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="familyDetails.motherLastName"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-gray-700">
                                    Last Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isUploading}
                                      placeholder="Enter mother's last name"
                                      {...field}
                                      className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex gap-4 w-full">
                            <FormField
                              control={form.control}
                              name="familyDetails.motherOccupation"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-gray-700">
                                    Occupation
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={occupations[0]}
                                    value={field.value}
                                    disabled={isUploading}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder="Select your mother's occupation"
                                          className="flex-1"
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="h-[250px]">
                                      {occupations.map((occupation) => (
                                        <SelectItem
                                          key={occupation}
                                          value={occupation}
                                        >
                                          {occupation}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="familyDetails.motherIncome"
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormLabel className="text-gray-700">
                                    Mother Income
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isUploading}
                                      placeholder="Enter your mother's income"
                                      {...field}
                                      className="focus-visible:ring-0 text-gray-700 focus-visible:ring-offset-0 focus-visible:border-gray-400 min-w-[300px]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <div className="w-full justify-end flex items-center gap-2 absolute bottom-0">
                          <Button type="button" className="" onClick={goBack}>
                            Previous
                          </Button>
                          <Button
                            type="button"
                            onClick={stepTwoSubmit}
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 !py-[2px]"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
              {currentStage === 2 && (
                <div className="flex-1">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(stepThreeSubmit)}
                      className="space-y-2 relative h-full"
                    >
                      <FormField
                        control={form.control}
                        name="documents.aadharCard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Aadhar Card
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                disabled={isUploading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="documents.marksheet12th"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              12th Marksheet
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                disabled={isUploading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="documents.marksheet10th"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              10th Marksheet
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                disabled={isUploading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="documents.proofOfIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Proof Of Income
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                disabled={isUploading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="documents.rationCard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Ration Card
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                disabled={isUploading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center gap-2 justify-end absolute bottom-0 right-0">
                        <Button
                          type="button"
                          onClick={goBack}
                          disabled={isUploading}
                        >
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          onClick={stepThreeSubmit}
                          disabled={isUploading}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoanApplicationPage;
