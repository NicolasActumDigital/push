import * as Slot from "@rn-primitives/slot";
import { SlottableTextProps, TextRef } from "@rn-primitives/types";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "@/lib/utils";

export type FontFamily =
  | "Roboto"
  | "Roboto-Medium"
  | "Roboto-Bold";

export const getFontFamily = (className: string): FontFamily => {
  if (className.includes("font-bold")) {
    return "Roboto-Bold";
  }
  if (
    className.includes("font-medium") ||
    className.includes("font-semibold")
  ) {
    return "Roboto-Medium";
  }
  return "Roboto";
};

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    const combinedClassName = cn(
      "text-base text-foreground web:select-text",
      textClass?.replace("font-bold", "").replace("font-semibold", "").replace("font-medium", ""),
      className?.replace("font-bold", "").replace("font-semibold", "").replace("font-medium", "")
    );

    const componentProps = {
      className: combinedClassName,
      style: {
        fontFamily: getFontFamily(cn(textClass, className)),
      },
      ...props,
    };

    return asChild ? (
      <Component {...componentProps} />
    ) : (
      <Component ref={ref} {...componentProps} />
    );
  },
);

Text.displayName = "Text";

export { Text, TextClassContext };
