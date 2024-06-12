"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schema/signInSchema";
import Link from "next/link";

export default function Page() {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsFormSubmitting(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        username: values.identifier,
        password: values.password,
      });

      if (response?.error) {
        toast({
          title: response.error,
          variant: "destructive",
        });
      }

      if (response?.ok) {
        toast({
          title: "You have signed in successfully.",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: error.message,
        variant: "destructive",
      });
      router.push("/");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-stone-100 w-1/4 p-4 rounded-md"
          method="POST"
        >
          <h3 className="text-left text-2xl">Sign In</h3>
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username or Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username or email"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="password"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-40" disabled={isFormSubmitting}>
            {isFormSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
          
        </form>
       
      </Form>
      <p>
          Don&apos;t have an account?{" "}
          <Link className="text-blue-700" href="/signup">
            Sign Up
          </Link>
        </p>
    </div>
  );
}
