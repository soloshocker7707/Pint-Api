import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  // Inject the secret from environment variables
  request.headers.set("x-zuplo-secret", process.env.SECRET_ZUPLO || "");
  return request;
}
