import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  // Use the official environment import for the 2025 runtime
  const secret = (environment as any).SECRET_ZUPLO || "";
  
  request.headers.set("x-zuplo-secret", secret.trim());
  return request;
}
