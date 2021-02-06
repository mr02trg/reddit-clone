export const RegisterMutation = `mutation Register($username: String!, $password: String!) {
  register(userInput: {username: $username, password: $password}) {
    errors {
      field,
      errorMsg
    },
    user {
      id,
      username,
      createdAt,
      updatedAt
    }
  }
}`