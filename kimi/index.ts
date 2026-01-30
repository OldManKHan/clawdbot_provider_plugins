import { emptyPluginConfigSchema } from "clawdbot/plugin-sdk";

const PROVIDER_ID = "kimi";
const PROVIDER_LABEL = "Kimi (月之暗面)";
const DEFAULT_MODEL = "kimi/kimi-k2.5";
const DEFAULT_BASE_URL = "https://api.moonshot.cn/v1";
const DEFAULT_CONTEXT_WINDOW = 128000;
const DEFAULT_MAX_TOKENS = 4096;

function buildModelDefinition(params: {
  id: string;
  name: string;
  input: Array<"text" | "image">;
  contextWindow?: number;
  maxTokens?: number;
  reasoning?: boolean;
}) {
  return {
    id: params.id,
    name: params.name,
    reasoning: params.reasoning ?? false,
    input: params.input,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: params.contextWindow ?? DEFAULT_CONTEXT_WINDOW,
    maxTokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
  };
}

const kimiPlugin = {
  id: "kimi-auth",
  name: "Kimi (月之暗面)",
  description: "API key authentication for Kimi (Moonshot AI) models",
  configSchema: emptyPluginConfigSchema(),
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/kimi",
      aliases: ["moonshot", "yuezhi"],
      envVars: ["KIMI_API_KEY", "MOONSHOT_API_KEY"],
      models: {
        baseUrl: DEFAULT_BASE_URL,
        api: "openai-completions",
        models: [
          // Kimi K2.5 系列 (最新)
          buildModelDefinition({
            id: "kimi-k2.5",
            name: "Kimi K2.5",
            input: ["text", "image"],
            contextWindow: 131072,
            maxTokens: 8192,
          }),
          // Kimi K2 系列
          buildModelDefinition({
            id: "kimi-k2-thinking",
            name: "Kimi K2 Thinking",
            input: ["text"],
            contextWindow: 262144,
            maxTokens: 16384,
            reasoning: true,
          }),
          buildModelDefinition({
            id: "kimi-k2-thinking-preview",
            name: "Kimi K2 Thinking Preview",
            input: ["text"],
            contextWindow: 262144,
            maxTokens: 16384,
            reasoning: true,
          }),
          // Moonshot V1 系列 (经典)
          buildModelDefinition({
            id: "moonshot-v1-8k",
            name: "Moonshot V1 8K",
            input: ["text"],
            contextWindow: 8000,
            maxTokens: 4096,
          }),
          buildModelDefinition({
            id: "moonshot-v1-32k",
            name: "Moonshot V1 32K",
            input: ["text"],
            contextWindow: 32000,
            maxTokens: 4096,
          }),
          buildModelDefinition({
            id: "moonshot-v1-128k",
            name: "Moonshot V1 128K",
            input: ["text"],
            contextWindow: 128000,
            maxTokens: 4096,
          }),
          buildModelDefinition({
            id: "moonshot-v1-auto",
            name: "Moonshot V1 Auto",
            input: ["text"],
            contextWindow: 128000,
            maxTokens: 4096,
          }),
        ],
      },
      auth: [
        {
          id: "api-key",
          label: "Kimi API Key",
          hint: "Enter your Moonshot API key",
          kind: "api_key",
          run: async (ctx) => {
            const key = await ctx.prompter.text({
              message: "Enter your Kimi (Moonshot) API key",
              validate: (value) => {
                if (!value?.trim()) return "API key is required";
                return undefined;
              },
            });

            const apiKey = String(key).trim();
            const profileId = `${PROVIDER_ID}:default`;

            return {
              profiles: [
                {
                  profileId,
                  credential: {
                    type: "api_key",
                    provider: PROVIDER_ID,
                    key: apiKey,
                  },
                },
              ],
              configPatch: {
                models: {
                  providers: {
                    [PROVIDER_ID]: {
                      baseUrl: DEFAULT_BASE_URL,
                      api: "openai-completions",
                      models: [
                        // Kimi K2.5 系列 (最新)
                        buildModelDefinition({
                          id: "kimi-k2.5",
                          name: "Kimi K2.5",
                          input: ["text", "image"],
                          contextWindow: 131072,
                          maxTokens: 8192,
                        }),
                        // Kimi K2 系列
                        buildModelDefinition({
                          id: "kimi-k2-thinking",
                          name: "Kimi K2 Thinking",
                          input: ["text"],
                          contextWindow: 262144,
                          maxTokens: 16384,
                          reasoning: true,
                        }),
                        buildModelDefinition({
                          id: "kimi-k2-thinking-preview",
                          name: "Kimi K2 Thinking Preview",
                          input: ["text"],
                          contextWindow: 262144,
                          maxTokens: 16384,
                          reasoning: true,
                        }),
                        // Moonshot V1 系列 (经典)
                        buildModelDefinition({
                          id: "moonshot-v1-8k",
                          name: "Moonshot V1 8K",
                          input: ["text"],
                          contextWindow: 8000,
                          maxTokens: 4096,
                        }),
                        buildModelDefinition({
                          id: "moonshot-v1-32k",
                          name: "Moonshot V1 32K",
                          input: ["text"],
                          contextWindow: 32000,
                          maxTokens: 4096,
                        }),
                        buildModelDefinition({
                          id: "moonshot-v1-128k",
                          name: "Moonshot V1 128K",
                          input: ["text"],
                          contextWindow: 128000,
                          maxTokens: 4096,
                        }),
                        buildModelDefinition({
                          id: "moonshot-v1-auto",
                          name: "Moonshot V1 Auto",
                          input: ["text"],
                          contextWindow: 128000,
                          maxTokens: 4096,
                        }),
                      ],
                    },
                  },
                },
                agents: {
                  defaults: {
                    models: {
                      "kimi/kimi-k2.5": { alias: "Kimi K2.5" },
                      "kimi/kimi-k2-thinking": { alias: "Kimi K2" },
                    },
                  },
                },
              },
              defaultModel: DEFAULT_MODEL,
              notes: [
                "Kimi (Moonshot) API key configured successfully.",
                `Default model set to ${DEFAULT_MODEL}.`,
                "Get your API key at: https://platform.moonshot.cn/",
              ],
            };
          },
        },
      ],
    });
  },
};

export default kimiPlugin;
