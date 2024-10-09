import { Text as RawText, TextProps as RawTextProps } from "@mantine/core";
import { ReactNode, forwardRef } from "react";
import { TypographyVariants } from "./variants";
import Colors from "@/common/constants/colors";
import { classNames } from "@/common/utils/styles";

export interface TextProps extends Omit<RawTextProps, "children"> {
  textVariant?: keyof typeof TypographyVariants;
  textColor?: keyof typeof Colors;
  wrap?: boolean;

  isResponsive?: boolean;
  children?: ReactNode;
}

const Text = forwardRef<HTMLDivElement, TextProps>((props, ref) => {
  const {
    className,
    textVariant = "regular",
    textColor = "foregroundPrimary",
    style,
    wrap,
    isResponsive = false,
    ...rest
  } = props;

  return (
    <RawText
      {...rest}
      ref={ref}
      style={{ color: textColor ? Colors[textColor] : undefined, ...style }}
      className={classNames(
        textVariant && TypographyVariants[textVariant],
        wrap ? "text-wrap" : "text-nowrap",
        className
      )}
    />
  );
});

Text.displayName = "Text";

export default Text;
