import { AxiosError } from "axios";
import api from "./api";
import { headers } from "next/headers";

export const getCurrentUser = async () => {
  try {
    const Cookie = headers().get("Cookie");
    const { data } = await api.get("/v1/auth/me", {
      headers: { Cookie },
      timeout: 350,
    });
    return data as { id: number };
  } catch (err) {
    if (!(err instanceof AxiosError)) return null;
    if (err.response?.status === 401) return null;
    return null;
  }
};
