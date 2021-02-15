import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import { Alert, AlertIcon, Flex, Button, AlertDescription, AlertTitle } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import createUrqlClient from '../utils/createUrqlClient';

import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [,forgotPassword] = useForgotPasswordMutation();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required('Required')
      .email('Please enter valid email')
  });

  return (
  <Wrapper size="small">
    {! submitted ? (
      <Formik
      initialValues={{ email: '' }}
      validationSchema={ForgotPasswordSchema}
      onSubmit = {async (values) => {
        await forgotPassword(values);
        setSubmitted(true);
      }}
      >
        {({isSubmitting}) => (
          <Form>
            <InputField 
              name="email" 
              placeholder="email" 
              label="Email"
              required/>

            <Flex mt="4">
              <Button colorScheme="teal" mr="auto" type="submit" isLoading={isSubmitting}>
                Forgot Password
              </Button>

              <Button color="black" variant="link" onClick={() => router.push("/login")}>
                Back to login
              </Button>
            </Flex>
            
          </Form>
        )}
      </Formik>
    ) : (
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Request submitted!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Please check your email for further instruction
        </AlertDescription>
      </Alert>
    )}
    
  </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);