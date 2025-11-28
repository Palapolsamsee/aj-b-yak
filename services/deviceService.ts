import { $fetch } from "ofetch";

export interface Device {
  id?: string | number;
  dvid: string;
  model?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  [key: string]: unknown;
}

type DevicePayload = Partial<Omit<Device, "id">>;

const resolveBaseUrl = () => {
  const config = useRuntimeConfig();
  const apiFromEnv = config.public?.YAKKAW_API;

  if (apiFromEnv && typeof apiFromEnv === "string" && apiFromEnv.trim().length) {
    return apiFromEnv.replace(/\/$/, "");
  }

  // Explicitly fail fast when misconfigured so we don't silently hit the app origin.
  throw new Error(
    "[deviceService] Missing public.YAKKAW_API. Set YAKKAW_API (or NUXT_PUBLIC_YAKKAW_API) to your devices API base URL."
  );
};

const request = async <T>(path = "", options: Parameters<typeof $fetch>[1] = {}) => {
  const base = resolveBaseUrl();
  const url = path ? `${base}/${path.replace(/^\//, "")}` : base;

  return $fetch<T>(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
  });
};

export const fetchDevices = async () => {
  return request<Device[]>();
};

export const createDevice = async (payload: DevicePayload) => {
  return request<Device>("", {
    method: "POST",
    body: payload,
  });
};

export const updateDevice = async (id: string | number, payload: DevicePayload) => {
  return request<Device>(String(id), {
    method: "PUT",
    body: payload,
  });
};

export const deleteDevice = async (id: string | number) => {
  await request(String(id), {
    method: "DELETE",
  });
};
