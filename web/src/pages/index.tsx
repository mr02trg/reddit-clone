import React from "react";
import { withUrqlClient } from "next-urql";
import { Box } from "@chakra-ui/react";
import createUrqlClient from "../utils/createUrqlClient";

import { Navbar } from "../components/Navbar";
import { Wrapper } from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [response,] = usePostsQuery();
  return (
    <>  
      <Navbar />
      <Wrapper>
        <Box>Hello World</Box>
        {response?.data && (
          response.data.posts.map((p, i) => (<Box key={i}>{p.title}</Box>))
        )}
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index)
