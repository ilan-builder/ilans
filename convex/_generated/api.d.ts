/* eslint-disable */
/**
 * Generated API types - will be regenerated when running `npx convex dev`
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as games from "../games.js";

declare const fullApi: ApiFromModules<{
  games: typeof games;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
