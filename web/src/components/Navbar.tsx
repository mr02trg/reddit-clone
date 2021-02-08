import React from "react";
import { Flex, Box, Heading, Spacer, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();
  const [{data}] = useMeQuery();
  const[{fetching: logOutFetching},logout] = useLogoutMutation();

  return (
    <Flex p="3" alignItems="center" bgColor="black">
      <Box>
        <Heading size="md" color="red">Reddit Clone</Heading>
      </Box>
      <Spacer />
      
        {data?.me ? (
          <Flex alignItems="center">
            <Box color="white" mr="4">Welcome {data?.me.username}!</Box>
            <Button colorScheme="blue" variant='outline' mr="4" isLoading={logOutFetching} onClick={() => logout()}>Log Out</Button>
          </Flex>
        ) : (
          <Box>
            <Button colorScheme="blue" variant='outline' mr="4" onClick={() => router.push('/register')}>
              Sign Up
            </Button>
            <Button colorScheme="blue" variant='outline' onClick={() => router.push('/login')}>Log in</Button>
          </Box>
        )}
    </Flex>
  )
}