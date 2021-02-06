import { UserError } from "../generated/graphql";
import { isEmpty } from 'lodash';

export const parseUserError = (backendErr: UserError[]) => {
  const err = {};
  for(let e of backendErr) {
    if(e.field) {
      err[e.field] = e.errorMsg;
    }
  }

  if (isEmpty(err)) {
    return backendErr[0].errorMsg;
  }
  return err;
}