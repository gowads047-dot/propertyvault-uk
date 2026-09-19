import type { Instrumentation } from "next";
import { describeError, recordError } from "@/lib/error-report";

/**
 * Every unhandled server error — a page, a route handler, a server action,
 * middleware — arrives here after Next has caught it, and goes into
 * app_errors with the request it happened on. The console.error stays, so
 * the function log still has it for the day it keeps things.
 *
 * Awaited, as the docs require: the function returns before the write is
 * acknowledged otherwise, and the runtime may end the invocation first.
 */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const { message, stack, digest } = describeError(err);
  console.error(`[${context.routeType}] ${request.method} ${request.path}: ${message}`);
  const ua = request.headers["user-agent"];
  await recordError({
    side: "server",
    message,
    stack,
    digest,
    path: request.path,
    method: request.method,
    router: context.routerKind,
    route_type: context.routeType,
    user_agent: Array.isArray(ua) ? ua[0] : ua,
    meta: { routePath: context.routePath, renderSource: context.renderSource },
  });
};
