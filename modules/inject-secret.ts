import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  const env = context.env || (globalThis as any).process?.env || {};
  const keys = Object.keys(env);
  
  let secret = env.SECRET_ZUPLO || env.ZUPLO_SECRET || env.secret_zuplo || "";
  
  if (!secret) {
    const foundKey = keys.find(k => k.toUpperCase().includes("SECRET") && k.toUpperCase().includes("ZUPLO"));
    if (foundKey) {
      secret = env[foundKey];
    }
  }

  // Debug: if still missing, send the list of keys in the header so we can see them in the error
  const headerValue = secret ? secret.trim() : `DEBUG_KEYS:${keys.join(",")}`;
  
  request.headers.set("x-zuplo-secret", headerValue);
  return request;
}
