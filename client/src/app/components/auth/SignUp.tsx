"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/redux/features/auth/authApi";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function SignUp({ setRoute, setOpen }: Props) {
  const [show, setShow] = useState(false);
  const [register, { isError, isLoading, error, data, isSuccess }] =
    useRegisterMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "Registration successful";
      toast.success(message);
      setRoute("verification");
    }
    if (error) {
      if ("data" in error) {
        const message = error as any;
        toast.error(message.data.message);
      }
    }
  }, [isSuccess, error]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    await register(values);
  };
  return (
    <>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Your Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="test@gmail.com"
                        {...field}
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
                  <FormItem className="mt-3 relative">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={!show ? "password" : "text"}
                        disabled={isLoading}
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    {!show ? (
                      <AiOutlineEyeInvisible
                        className="absolute bottom-3 right-2 z-[1] cursor-pointer"
                        size={20}
                        onClick={() => setShow(true)}
                      />
                    ) : (
                      <AiOutlineEye
                        className="absolute bottom-3 right-2 z-[1] cursor-pointer"
                        size={20}
                        onClick={() => setShow(false)}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-center w-full">
                <Button disabled={isLoading} size="lg" type="submit">
                  Sign Up
                </Button>
              </div>
              <br />
              <h5 className="text-center pt-2 font-Poppins text-[14px] text-black dark:text-white">
                Or Join with
              </h5>
              <div className="flex items-center justify-center w-full py-3">
                <FcGoogle size={30} className="cursor-pointer mr-2" />
                <AiFillGithub size={30} className="cursor-pointer ml-2" />
              </div>
              <h5 className="text-center pt-2 font-Poppins text-[14px]">
                Already have an account?{" "}
                <span
                  className="text-[#2190ff] pl-1 cursor-pointer"
                  onClick={() => {
                    setRoute("login");
                    setOpen(true);
                  }}
                >
                  Log In
                </span>
              </h5>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
