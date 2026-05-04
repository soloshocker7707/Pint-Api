import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  // Use context.env - this is the standard way. 
  // It will work once the variable is saved in the Zuplo Portal settings.
  const secret = context.env?.SECRET_ZUPLO || "";
  
  request.headers.set("x-zuplo-secret", secret.trim());
  return request;
}
