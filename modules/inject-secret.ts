import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  // Access the environment variable directly from context.env
  // We use a robust lookup to handle any runtime variations
  const secret = context.env?.SECRET_ZUPLO || (globalThis as any).process?.env?.SECRET_ZUPLO || "";
  
  request.headers.set("x-zuplo-secret", secret.trim());
  return request;
}
