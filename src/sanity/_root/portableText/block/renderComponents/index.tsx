import React from "react";
import { Text } from "@sanity/ui";
import { HeadingComponentProps } from "./interface";


export const HeadingComponent = ({
  children,
  value,
}: HeadingComponentProps) => {
  let fontSize: string;

  switch (value) {
    case "h1":
      fontSize = "38px";
      break;
    case "h2":
      fontSize = "32px";
      break;
    case "h3":
      fontSize = "28px";
      break;
    default:
      fontSize = "24px";
  }

  return (
    <Text
      style={{
        fontSize,
      }}
    >
      {children}
    </Text>
  );
};
