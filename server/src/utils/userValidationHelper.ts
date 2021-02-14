import { UserError, UserRegisterRequest } from "src/resolvers/user";

const MIN_PASSWORD_LENGTH = 4;
const MIN_USERNAME_LENGTH = 3;

export const validateUserRegister = (request: UserRegisterRequest): UserError[] => {
  let errors: UserError[] = [];
  if (request.password.length < MIN_PASSWORD_LENGTH) {
    errors.push({
      field: 'password',
      errorMsg: 'Password is too short'
    })
  }
  
  if (request.username.length < MIN_USERNAME_LENGTH) {
    errors.push({
      field: 'username',
      errorMsg: 'Username is too short'
    })
  }

  return errors;
}