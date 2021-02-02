import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string,
  name: string,
  required?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({label, size: _, required, ...props}) => {
  const [field, meta] = useField(props);
  return (
    <FormControl isInvalid={meta.error && meta.touched} isRequired={required}> 
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
