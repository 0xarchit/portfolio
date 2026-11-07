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
          const res = await fetch("/api/portfolio");
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

      const toolMap = new Map<string, ModelContextTool>(
        tools.map((t) => [t.name, t])
      );

      const modelContextBridge = {
        registerTool: (t: ModelContextTool) => {
          toolMap.set(t.name, t);
        },
        listTools: () => Array.from(toolMap.values()),
        provideContext: ({ tools: tList }: { tools: ModelContextTool[] }) => {
          for (const t of tList) toolMap.set(t.name, t);
        },
        executeTool: async (name: string, input: Record<string, unknown> = {}) => {
          const tool = toolMap.get(name);
          if (!tool) {
            throw new Error(`WebMCP Tool "${name}" not found.`);
          }
          return await tool.execute(input);
        },
      };

      // 1. Native or polyfilled document.modelContext (W3C standard)
      if (typeof document !== "undefined") {
        if (document.modelContext?.registerTool) {
          try {
            for (const tool of tools) {
              document.modelContext.registerTool(tool, { signal: controller.signal });
            }
          } catch (e) {
            console.warn("[WebMCP] document.modelContext registration warning:", e);
          }
        } else {
          try {
            Object.defineProperty(document, "modelContext", {
              value: modelContextBridge,
              configurable: true,
              writable: true,
            });
          } catch {
            (document as any).modelContext = modelContextBridge;
          }
        }
      }

      // 2. Native or polyfilled navigator.modelContext (early spec / browser flags)
      if (typeof navigator !== "undefined") {
        if (navigator.modelContext?.registerTool) {
          try {
            for (const tool of tools) {
              navigator.modelContext.registerTool(tool, { signal: controller.signal });
            }
          } catch (e) {
            console.warn("[WebMCP] navigator.modelContext registration warning:", e);
          }
        } else {
          try {
            Object.defineProperty(navigator, "modelContext", {
              value: modelContextBridge,
              configurable: true,
              writable: true,
            });
          } catch {
            try {
              (navigator as any).modelContext = modelContextBridge;
            } catch {
              // Ignore if navigator is frozen
            }
          }
        }
      }

      // 3. Register global client bridge for extensions, testing, and automation agents
      if (typeof window !== "undefined") {
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

        window.modelContext = modelContextBridge;
      }
    }

    initializeTools();

    return () => {
      isMounted = false;
      controller.abort();
      if (typeof window !== "undefined") {
        delete window.__webmcp;
        delete (window as any).modelContext;
      }
      if (typeof document !== "undefined") {
        try {
          delete (document as any).modelContext;
        } catch {
          // Ignore
        }
      }
    };
  }, [initialData, initialPosts]);

  return null;
}
