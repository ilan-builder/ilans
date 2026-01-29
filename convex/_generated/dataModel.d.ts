/* eslint-disable */
/**
 * Generated data model - will be regenerated when running `npx convex dev`
 */

import type { DataModelFromSchemaDefinition } from "convex/server";
import type { DocumentByName, GenericId } from "convex/server";
import schema from "../schema.js";

export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

export type Id<TableName extends keyof DataModel> = GenericId<TableName>;

export type Doc<TableName extends keyof DataModel> = DocumentByName<
  DataModel,
  TableName
>;
