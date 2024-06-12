"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/schema/signUpSchema";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";


export default function Page() {
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [usernameResponse, setUsernameResponse] = useState("");

  const router = useRouter();
  const {toast} = useToast();

  const signUpSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
  });
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    
    if (form.watch("username")) {
      const debouncing = setTimeout(async () => {
        setIsUsernameChecking(true);
        try {
          const response = await axios.post("/api/user/verifyusername", {
            username: form.watch("username"),
          });
          if (response.data.success) {
            setUsernameResponse(response.data.message);
          } else {
            setUsernameResponse(response.data.message || "Username is invalid");
          }
        } catch (error) {
          setUsernameResponse(error.response?.data.message || "An error occurred");
        } finally {
          setIsUsernameChecking(false);
        }
      }, 1000);

      return () => clearTimeout(debouncing);
    }
  }, [form.watch("username")]);

  const onSubmit = async (values) => {
    
    setIsUsernameChecking(true);
    try {
      const response = await axios.post("/api/user/signup", values);
      if (response.data.success) {
        toast({
            title:response.data.message
        })
        router.push(`/verifyemail/${values.username}`);
      }
    } catch (error) {
      
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.response?.data.message || error.message,
      });
    } finally {
      setIsUsernameChecking(false);
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
          <h3 className="text-left text-2xl">Sign Up</h3>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                {usernameResponse && (
                  <FormDescription>{usernameResponse}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} className="h-12" />
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
          <Button
            type="submit"
            className="w-40"
            disabled={isUsernameChecking}
          >
            {isUsernameChecking ? (
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
        Already have an account?{" "}
        <Link className="text-blue-700" href="/signin">
          Sign In
        </Link>
      </p>
    </div>
  );
}
