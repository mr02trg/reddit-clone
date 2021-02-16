import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link'
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import createUrqlClient from '../../utils/createUrqlClient';

import { Wrapper } from '../../components/Wrapper';
import { InputField } from '../../components/InputField';
import { useChangePasswordMutation } from '../../generated/graphql';

const ForgotPassword = () => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState<string>();
  const [,changePassword] = useChangePasswordMutation();
  const ChangePasswodSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required')
  });

  return (
    <Wrapper size="small">
        <Formik
        initialValues={{ password: '' }}
        validationSchema={ChangePasswodSchema}
        onSubmit = {async (values) => {
          const token = router.query.token as string;
          const { data } = await changePassword({...values, token})
          if (data.changePassword.errors) {
            setTokenError(data.changePassword.errors[0].errorMsg);
          } else if (data.changePassword.user) {
            router.push("/");
          }
        }}
        >
          {() => (
            <Form>
              <InputField 
                type="password"
                name="password" 
                placeholder="password" 
                label="Password"
                required/>

              <Box mt="4">
                {tokenError && (
                  <Box>
                    <Box color="red" as="span" mr="2">{tokenError}.</Box>
                    <NextLink href="/forgot-password">
                      <Link>Click here to get a new one</Link>
                    </NextLink>
                  </Box>
                )}
                <Button colorScheme="teal" mt="4" mr="auto" type="submit">
                  Change Password
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);