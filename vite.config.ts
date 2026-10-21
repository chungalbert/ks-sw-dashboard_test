import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const emptyFs = path.resolve(rootDir, "src/shims/empty-fs.ts");
const emptyMessages = path.resolve(rootDir, "src/shims/empty-ts-evtx-messages.ts");

export default defineConfig({
  plugins: [react()],
  // @ts-evtx/core reads process.env.EVTX_DEBUG at import time and crashes the login page in the browser.
  define: { "process.env.EVTX_DEBUG": "false" },
  base: process.env.GITHUB_ACTIONS ? "/ks-sw-dashboard_test/" : "/",
  resolve: {
    alias: [
      { find: /^node:fs\/promises$/, replacement: emptyFs },
      { find: /^node:fs$/, replacement: emptyFs },
      { find: /^fs\/promises$/, replacement: emptyFs },
      { find: /^fs$/, replacement: emptyFs },
      { find: "@ts-evtx/messages", replacement: emptyMessages },
    ],
  },
  optimizeDeps: {
    include: ["exceljs", "frappe-gantt/dist/frappe-gantt.js", "@ts-evtx/core"],
    needsInterop: ["frappe-gantt/dist/frappe-gantt.js"],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
