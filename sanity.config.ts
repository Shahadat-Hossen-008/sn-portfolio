"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import {
  schema,
  singletonDocumentActions,
} from "./src/sanity/schemaTypes";
import { CustomPortableTextInput } from "./src/sanity/components/portable-text-input";
import { structure } from "./src/sanity/structure";
import "./src/sanity/studio.css";

export default defineConfig({
  name: "shahadat-portfolio",
  title: "Shahadat's Portfolio",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  form: {
    components: {
      input: CustomPortableTextInput,
    },
  },
  document: {
    // Singletons only: every other schema type keeps the stock action list.
    actions: singletonDocumentActions,
  },
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    // Code plugin in schema
    codeInput(),
  ],
});
