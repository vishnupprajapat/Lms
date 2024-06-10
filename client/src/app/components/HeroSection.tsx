import Image from "next/image";
import React from "react";
type Props = {};

const HeroSection: React.FC<Props> = (props) => {
  return (
    <div className="dark:bg-[#010100] bg-[rgb(231,241,250)] pb-10">
      <div className="relative z-1">
        <div className="w-[95%] md:!w-[90%] 2xl:!w-[85%] m-auto flex-col md:flex items-center justify-center  relative">
          <div className="w-full md:flex items-center justify-end flex-row-reverse pt-10 md:pt-0">
            <div className="md:w-[50%] w-full">
              <Image
                src={require("../../../public/banner.svg")}
                alt="hero"
                className="object-contain 1000px:max-w-[90%] 1000px:max-w[85%] h-auto"
              />
            </div>
            <div className="w-full md:w-[50%] flex flex-col md:justify-center items-center md:items-start">
              <h1 className="text-[25px] font-[500] font-Poppins text-center py-2 !text-[25px] md:!text-5xl !text-left md:!leading-[60px]">
                Start your{" "}
                <span className="dark:text-gradient text-gradient_light">
                  programming{" "}
                </span>
                <br />
                <span className="dark:text-gradient text-gradient_light">
                  Journey
                </span>
              </h1>
              <div className="md:w-[95%] w-full flex flex-col items-center md:block">
                <p className="block font-poppins md:text-[22px] md:leading-[32px] text-[16px] leading-[25px] font-normal dark:text-[#A3B3BC] mb-5 text-center md:text-left">
                  Begin your coding adventure in our community, where learning
                  is always appreciated and valued.
                </p>
                <br />
                <a
                  href="#"
                  className="z-0 group relative box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-unit-20 h-unit-10 gap-unit-2 [&>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] text-[16px] font-Poppins font-semibold w-[200px] text-white"
                  role="button"
                >
                  Explore Resources
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
