import { useAuth } from "@clerk/clerk-react";

function getFetchOptions(token: string | null, options?: RequestInit) {
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchOptions;
}
export default function useFetch() {
  // Use `useAuth()` to access the `getToken()` method
  const { getToken } = useAuth();

  const customFetch = async (
    input: RequestInfo | URL,
    options?: RequestInit,
  ): Promise<Response> => {
    // Use `getToken()` to get the current session token
    const token = await getToken();
    return fetch(input, getFetchOptions(token, options));
  };

  return { customFetch };
}