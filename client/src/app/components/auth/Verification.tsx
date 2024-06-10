"use client";
import { Button } from "@/components/ui/button";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification = ({ setRoute, setOpen }: Props) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("login");
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const message = error as any;
        toast.error(message.data.message);
        setInvalidError(true);
      }
    }
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  const verificationHandler = async () => {
    // Add your verification logic here
    const otp = Object.values(verifyNumber).join("");
    if (otp.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({ activation_token: token, activation_code: otp });
  };

  const handleInput = (index: number, value: string) => {
    setInvalidError(false);
    if (value.match(/^\d?$/)) {
      const newVerifyNumber = { ...verifyNumber, [index]: value };
      setVerifyNumber(newVerifyNumber);
      if (value === "" && index > 0) {
        inputRefs[index - 1].current?.focus();
      } else if (value.length === 1 && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  return (
    <div>
      <h1 className="text-[25px] text-black dark:text-white font-[500] font-Poppins text-center py-2">
        Verify Your Account
      </h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[88px] rounded-full bg-[#497df2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} color="white" />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            key={key}
            type="number"
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInput(index, e.target.value)}
            className={`w-[50px] h-[50px] text-[18px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-center font-Poppins font-[500] outline-none ${
              invalidError
                ? "shake border-red-500"
                : "dark:border-white border-[#0000004a]"
            }`}
            ref={inputRefs[index]}
            placeholder=""
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.value.length > 1) {
                input.value = input.value.slice(0, 1);
              }
            }}
          />
        ))}
      </div>
      <br />
      <br />
      <Button
        size="lg"
        variant="default"
        className="w-full"
        onClick={verificationHandler}
      >
        Verify Otp
      </Button>
      <br />
      <h5 className="text-center pt-2 font-Poppins text-[14px]">
        Go back to sign in?{" "}
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
    </div>
  );
};

export default Verification;
