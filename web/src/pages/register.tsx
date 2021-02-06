import React from 'react';
import { Wrapper } from '../components/Container';
import { Formik, Form } from 'formik';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useMutation } from 'urql';
import { RegisterMutation } from '../graphql/mutations/register.graphql';

const Register = () => {
  const[, register] = useMutation(RegisterMutation);

  const submit = (values) => {
    return register(values);
  }

  return (
  <Wrapper size="small">
    <Formik
      initialValues={{username: '', password: ''}}
      onSubmit = {(values) => submit(values)}
    >
      {({isSubmitting}) => (
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

export default Register;