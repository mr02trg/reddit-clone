import { Box } from "@chakra-ui/react";
import React from "react";

export type WrapperSize = "small" | "regular";

interface WrapperProps {
  size?: WrapperSize;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  size = "regular"
}) => {
  return (
    <Box
      mt="4"
      mx="auto"
      maxWidth={size === 'regular' ? "800px" : "400px"}
      width="100%"
    >
      {children}
    </Box>
  )
};
