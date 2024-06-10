import React, { FC } from "react";

interface MetaProps {
  title: string;
  description: string;
  keywords: string;
}

const MetaTag: FC<MetaProps> = ({ title, description, keywords }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </>
  );
};

export default MetaTag;
