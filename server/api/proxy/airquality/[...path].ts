import { useRuntimeConfig } from "#imports";
import { createError, defineEventHandler, getQuery, proxyRequest } from "h3";
import { joinURL, withQuery } from "ufo";
import { Agent } from "undici";

const insecureHttpsAgent = new Agent({
  connect: { rejectUnauthorized: false },
});

export default defineEventHandler((event) => {
  const { airqualityProxyTarget, airqualityProxyAllowInsecure } =
    useRuntimeConfig();

  if (!airqualityProxyTarget) {
    throw createError({
      statusCode: 500,
      statusMessage: "airqualityProxyTarget is not configured",
    });
  }

  const upstreamBase = airqualityProxyTarget.replace(/\/$/, "");
  const slugParam = event.context.params?.path;
  const pathSegments = Array.isArray(slugParam)
    ? slugParam
    : slugParam
      ? [slugParam]
      : [];
  const relativePath = pathSegments.filter(Boolean).join("/");

  const targetUrl = withQuery(
    relativePath ? joinURL(upstreamBase, relativePath) : upstreamBase,
    getQuery(event),
  );

  const fetchOptions =
    airqualityProxyAllowInsecure && targetUrl.startsWith("https://")
      ? { dispatcher: insecureHttpsAgent }
      : undefined;

  return proxyRequest(event, targetUrl, {
    fetchOptions,
  });
});
