export interface ModelContextInputSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description: string;
    enum?: string[];
    items?: { type: string };
  }>;
  required?: string[];
  additionalProperties?: boolean;
}

// eslint-disable-next-html-element-suppression
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ModelContextTool<TInput = any, TOutput = any> {
  name: string;
  description: string;
  inputSchema: ModelContextInputSchema;
  execute: (input: TInput) => Promise<TOutput> | TOutput;
}

export interface ModelContextRegisterOptions {
  signal?: AbortSignal;
}

export interface ModelContextInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerTool: <TInput = any, TOutput = any>(
    tool: ModelContextTool<TInput, TOutput>,
    options?: ModelContextRegisterOptions
  ) => Promise<void> | void;
  provideContext?: (context: { tools: ModelContextTool[] }) => Promise<void> | void;
  listTools?: () => ModelContextTool[];
}

export interface WebMcpBridge {
  version: string;
  tools: Map<string, ModelContextTool>;
  executeTool: (name: string, input?: Record<string, unknown>) => Promise<unknown>;
  listTools: () => Array<{
    name: string;
    description: string;
    inputSchema: ModelContextInputSchema;
  }>;
}

declare global {
  interface Document {
    modelContext?: ModelContextInterface;
  }

  interface Navigator {
    modelContext?: ModelContextInterface;
  }

  interface Window {
    modelContext?: ModelContextInterface;
    __webmcp?: WebMcpBridge;
  }
}
