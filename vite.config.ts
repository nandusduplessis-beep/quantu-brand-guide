import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from "vite";

function remotionRenderApi(): Plugin {
  return {
    name: "remotion-render-api",
    configureServer(server) {
      server.middlewares.use("/api/render", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }

        let body = "";
        req.on("data", (chunk: Buffer) => (body += chunk.toString()));
        req.on("end", async () => {
          try {
            const { compositionId, props } = JSON.parse(body);
            const { execSync } = await import("child_process");
            const fs = await import("fs");
            const os = await import("os");

            const outDir = path.join(os.default.tmpdir(), "remotion-renders");
            fs.default.mkdirSync(outDir, { recursive: true });
            const outPath = path.join(outDir, `${compositionId}-${Date.now()}.mp4`);

            const propsArg = JSON.stringify(props).replace(/'/g, "'\\''");
            const entryPoint = path.resolve(__dirname, "src/remotion/index.ts");

            execSync(
              `npx remotion render "${entryPoint}" ${compositionId} "${outPath}" --props='${propsArg}'`,
              { stdio: "pipe", timeout: 120_000 },
            );

            const file = fs.default.readFileSync(outPath);
            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Content-Disposition", `attachment; filename="${compositionId}.mp4"`);
            res.end(file);

            fs.default.unlinkSync(outPath);
          } catch (err: any) {
            res.statusCode = 500;
            res.end(err.message || "Render failed");
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && remotionRenderApi(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
