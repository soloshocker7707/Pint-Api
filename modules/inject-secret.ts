import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: any,
  policyName: string
) {
  // Defensive lookup: try exactly what we expect, then look for common variations
  const env = context.env || (globalThis as any).process?.env || {};
  
  let secret = env.SECRET_ZUPLO || env.ZUPLO_SECRET || env.secret_zuplo || "";
  
  // If still not found, look for any key that looks like our secret
  if (!secret) {
    const keys = Object.keys(env);
    const foundKey = keys.find(k => k.toUpperCase().includes("SECRET") && k.toUpperCase().includes("ZUPLO"));
    if (foundKey) {
      secret = env[foundKey];
    }
  }

  request.headers.set("x-zuplo-secret", (secret || "").trim());
  return request;
}
