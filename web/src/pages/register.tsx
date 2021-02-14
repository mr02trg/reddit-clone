import React from 'react';
import { withUrqlClient } from 'next-urql';
import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/router";
import { useRegisterMutation } from '../generated/graphql';
import createUrqlClient from '../utils/createUrqlClient';

import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { parseUserError } from '../utils/parseUserError';

const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .required('Required'),
    email: Yup.string()
      .required('Required')
      .email('Please enter valid email'),
    password: Yup.string()
      .required('Required')
  });

  return (
  <Wrapper size="small">
    <Formik
      initialValues={{username: '', email: '', password: ''}}
      validationSchema={RegisterSchema}
      onSubmit = {async (values, { setErrors, setStatus } ) => {
        setStatus(null);
        const response = await register(values);
        if(response.data?.register.errors) {
          const errors = parseUserError(response.data?.register.errors);
          if(typeof errors === 'string') {
            setStatus(errors);
          } else {
            setErrors(errors);
          }
        }
        else if (response.data?.register.user) {
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
          
          <InputField 
            name="email" 
            placeholder="email" 
            label="Email"
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
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
              Register
            </Button>
          </Box>
          
        </Form>
      )}
    </Formik>
  </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Register);