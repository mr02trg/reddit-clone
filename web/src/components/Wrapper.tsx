import { Box } from "@chakra-ui/react";
import React from "react";
import { useWindowSize } from "../hooks/useWindowSize";

export type WrapperSize = "small" | "regular";

interface WrapperProps {
  size?: WrapperSize;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  size = "regular"
}) => {

  const {width} = useWindowSize();
  const getPx = () => {
    if ((size === 'regular' && width < 801) ||
      (size === 'small' && width < 401)) {
        return "3"
      }
    return null
  }
  return (
    <Box
      mt="4"
      mx="auto"
      px={getPx()}
      maxWidth={size === 'regular' ? "800px" : "400px"}
      width="100%"
    >
      {children}
    </Box>
  )
};
