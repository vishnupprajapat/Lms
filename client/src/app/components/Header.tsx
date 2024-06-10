"use client";
import Link from "next/link";
import React, { FC, useState } from "react";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiUserCircle } from "react-icons/hi";
import { CustomModal } from "@/components/modal/Custom-modal";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Verification from "./auth/Verification";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem?: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ setOpen, open, activeItem, route, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, SetOpenSidebar] = useState(false);
  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      SetOpenSidebar(false);
    }
  };
  return (
    <header className="w-full border-b bg-[rgb(232_246_255/68%)] dark:bg-[unset] dark:border-[#ffffff1c] h-[80px] sticky top-0 inset-x-0 z-[80] dark:shadow backdrop-blur-lg backdrop-saturate-150">
      <div className="">
        <div className="w-[95%] lg:w-92% m-auto py-2 h-full">
          <div className="w-full flex items-center justify-between p-3">
            <div className="">
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white logo`}
              >
                ELearning
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems isMobile={false} />
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="lg:hidden">
                <HiOutlineMenuAlt3
                  size={30}
                  className="curser-pointer dark:text-white text-black"
                  onClick={() => SetOpenSidebar(true)}
                />
              </div>
              <HiUserCircle
                size={30}
                className="dark:text-white cursor-pointer text-black ml-3"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>
        {/* mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full lg:hidden h-screen top-0 left-0 dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed pl-8 z[999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems isMobile={true} />
              <HiUserCircle
                size={30}
                className="curser-pointer dark:text-white text-black "
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] px-2 text-black dark:text-white">
                copyright &copy; 2024 ELearning
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "login" && (
        <>
          {open && (
            <>
              <CustomModal
                title="Login"
                description="Get access to our educational content"
                isOpen={open}
                onClose={() => setOpen(false)}
              >
                <Login setRoute={setRoute} setOpen={setOpen} />
              </CustomModal>
            </>
          )}
        </>
      )}
      {route === "Sign-Up" && (
        <>
          {open && (
            <>
              <CustomModal
                title="Sign Up"
                description="Create a Account"
                isOpen={open}
                onClose={() => setOpen(false)}
              >
                <SignUp setRoute={setRoute} setOpen={() => open} />
              </CustomModal>
            </>
          )}
        </>
      )}
      {route === "verification" && (
        <>
          {open && (
            <>
              <CustomModal
                title="verification"
                description="verify your account Account"
                isOpen={open}
                onClose={() => setOpen(false)}
              >
                <Verification setRoute={setRoute} setOpen={() => open} />
              </CustomModal>
            </>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
