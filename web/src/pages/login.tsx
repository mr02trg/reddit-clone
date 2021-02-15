import React from 'react';
import { withUrqlClient } from 'next-urql';
import { Box, Button, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/router";
import createUrqlClient from '../utils/createUrqlClient';

import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { parseUserError } from '../utils/parseUserError';
import { useLoginMutation } from '../generated/graphql';

const Login = () => {
  const router = useRouter();
  const[,login] = useLoginMutation();

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required('Required'),
    password: Yup.string()
      .required('Required')
  });

  return (
  <Wrapper size="small">
    <Formik
      initialValues={{username: '', password: ''}}
      validationSchema={LoginSchema}
      onSubmit = {async (values, { setStatus, setErrors } ) => {
        const loginResponse = await login(values);
        if (loginResponse.data?.login.errors) {
          const errors = parseUserError(loginResponse.data?.login.errors);
          if(typeof errors === 'string') {
            setStatus(errors);
          } else {
            setErrors(errors);
          }
        } else if (loginResponse.data?.login.user) {
          router.push("/");
        }
      }}
    >
      {({status, isSubmitting}) => (
        <Form>
          <InputField 
            name="username" 
            placeholder="username" 
            label="Username"
            required/>
          
          <Box mt="4">
            <InputField 
              type="password"
              name="password" 
              placeholder="password" 
              label="Password" 
              required/>
          </Box>
          <Box mt="4">
            <Box mb="3" color="red">{status}</Box>
            <Flex>
              <Button colorScheme="teal" mr="auto" type="submit" isLoading={isSubmitting}>
                Login
              </Button>
              <Button color="black" variant="link" onClick={() => router.push("/forgot-password")}>
                Forgot Password?
              </Button>
            </Flex>
          </Box>          
        </Form>
      )}
    </Formik>
  </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Login);