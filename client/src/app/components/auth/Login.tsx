"use client";
import React, { useState } from "react";
import * as z from "zod";
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
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};
const formSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login({ setRoute, setOpen }: Props) {
  const [login, { isLoading }] = useLoginMutation();
  const [show, setShow] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      await login(values).unwrap();
      setOpen(false);
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
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
                  LogIn
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
                Not have any account?{" "}
                <span
                  className="text-[#2190ff] pl-1 cursor-pointer"
                  onClick={() => {
                    setRoute("Sign-Up");
                    setOpen(true);
                  }}
                >
                  Sign Up
                </span>
              </h5>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
