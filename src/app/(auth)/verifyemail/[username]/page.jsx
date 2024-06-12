"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { verifyCodeSchema } from "@/schema/verifySchema";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


export default function Page({params}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
 const username=params.username
  const verifyCode = z.object({
    verifyCode: verifyCodeSchema,
  });
  const form = useForm({
    resolver: zodResolver(verifyCode),
    defaultValues: {
      verifyCode: "",
    },
  });
  const onSubmit = async (values) => {
    try {
      setIsVerifying(true);
      const response = await axios.post("/api/user/verifyemail", {
        username: username,
        verifyCode: values.verifyCode,
      });
      if (response.data.success) {
        toast({
          title: response.data.message,
        });
        router.push("/signin");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-15 p-9 space-y-6 bg-stone-100 rounded-md"
          method="POS"
        >
          <FormField
            control={form.control}
            name="verifyCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl">Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="h-14 tex-lg border-black "
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-14 tex-lg border-black"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-14 tex-lg border-black"
                      />
                      <InputOTPSlot
                        index={3}
                        className="h-14 tex-lg border-black"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-14 tex-lg border-black"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-14 tex-lg border-black"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time verification code sent to your
                  email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-40" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
