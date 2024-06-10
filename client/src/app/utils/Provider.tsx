import React from "react";
import { Provider as Pr } from "react-redux";
import { store } from "@/redux/store/store";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Pr store={store}>{children}</Pr>;
}
