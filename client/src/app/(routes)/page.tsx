"use client";
import React, { FC, useState } from "react";
import MetaTag from "../utils/MetaTag";
import HeroSection from "../components/HeroSection";

interface Props {}
const Home: FC<Props> = (props: Props) => {
  return (
    <>
      <MetaTag
        title="ELearning"
        description="ELearning is a platform for student  to learn and get help from teachers "
        keywords="React, MERN, Next Js Redux"
      />
      <HeroSection />
    </>
  );
};
export default Home;
