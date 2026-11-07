"use client";

import { useEffect, useRef } from "react";
import { AllPortfolioData, BlogPost } from "@/types/api";
import { createWebMcpTools } from "@/utils/webmcp";
import { ModelContextTool } from "@/types/webmcp";

interface WebMcpProviderProps {
  initialData?: AllPortfolioData | null;
  initialPosts?: BlogPost[];
}

export function WebMcpProvider({ initialData, initialPosts }: WebMcpProviderProps) {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    async function initializeTools() {
      let portfolioData = initialData;
      let posts = initialPosts || [];

      // Fetch latest portfolio data if not passed
      if (!portfolioData) {
        try {
          const res = await fetch("https://0xarchit.val.run/v1/all");
          if (res.ok) {
            portfolioData = await res.json();
          }
        } catch {
          // Fallback to empty if offline
        }
      }

      if (!isMounted) return;

      const tools: ModelContextTool[] = createWebMcpTools({
        portfolioData,
        posts,
      });

      // 1. Register with Document WebMCP interface (W3C standard)
      if (typeof document !== "undefined" && document.modelContext?.registerTool) {
        try {
          for (const tool of tools) {
            document.modelContext.registerTool(tool, { signal: controller.signal });
          }
        } catch (e) {
          console.warn("[WebMCP] document.modelContext registration warning:", e);
        }
      }

      // 2. Register with Navigator WebMCP interface (early spec / browser flags)
      if (typeof navigator !== "undefined" && navigator.modelContext?.registerTool) {
        try {
          for (const tool of tools) {
            navigator.modelContext.registerTool(tool, { signal: controller.signal });
          }
        } catch (e) {
          console.warn("[WebMCP] navigator.modelContext registration warning:", e);
        }
      }

      // 3. Register global client bridge for extensions, testing, and automation agents
      if (typeof window !== "undefined") {
        const toolMap = new Map<string, ModelContextTool>(
          tools.map((t) => [t.name, t])
        );

        window.__webmcp = {
          version: "1.0.0",
          tools: toolMap,
          listTools: () =>
            tools.map(({ name, description, inputSchema }) => ({
              name,
              description,
              inputSchema,
            })),
          executeTool: async (name: string, input: Record<string, unknown> = {}) => {
            const tool = toolMap.get(name);
            if (!tool) {
              throw new Error(`WebMCP Tool "${name}" not found.`);
            }
            return await tool.execute(input);
          },
        };

        window.modelContext = {
          registerTool: (t: ModelContextTool) => {
            toolMap.set(t.name, t);
          },
          listTools: () => Array.from(toolMap.values()),
        };
      }
    }

    initializeTools();

    return () => {
      isMounted = false;
      controller.abort();
      if (typeof window !== "undefined") {
        delete window.__webmcp;
      }
    };
  }, [initialData, initialPosts]);

  return null;
}
