import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  // Inject the secret passed from options (which Zuplo resolves from env)
  request.headers.set("x-zuplo-secret", options.secret || "");
  return request;
}
