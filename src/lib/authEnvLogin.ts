import magicApiAuth from "@/services/magic_api/auth";

export function getAuthCredentials() {
  const email = process.env.NEXT_PUBLIC_AUTH_EMAIL;
  const password = process.env.NEXT_PUBLIC_AUTH_PASSWORD;
  const magicId = process.env.NEXT_PUBLIC_AUTH_MAGIC_ID;
  if (!email || !password || !magicId) return null;
  return { email, password, magicId };
}

export function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("loginToken", accessToken);
  sessionStorage.setItem("loginToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  sessionStorage.setItem("refreshToken", refreshToken);
}

export async function loginWithEnvCredentials(): Promise<boolean> {
  const creds = getAuthCredentials();
  if (!creds) return false;
  try {
    const res = await magicApiAuth.emailLogin(creds);
    if (res?.data?.accessToken && res?.data?.refreshToken) {
      storeTokens(res.data.accessToken, res.data.refreshToken);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
