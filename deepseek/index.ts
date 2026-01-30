import { emptyPluginConfigSchema } from "clawdbot/plugin-sdk";

const PROVIDER_ID = "deepseek";
const PROVIDER_LABEL = "DeepSeek (深度求索)";
const DEFAULT_MODEL = "deepseek/deepseek-chat";
const DEFAULT_BASE_URL = "https://api.deepseek.com/v1";
const DEFAULT_CONTEXT_WINDOW = 65536;
const DEFAULT_MAX_TOKENS = 8192;

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

const MODELS = [
  // DeepSeek V3 系列 (Chat)
  buildModelDefinition({
    id: "deepseek-chat",
    name: "DeepSeek V3",
    input: ["text"],
    contextWindow: 65536,
    maxTokens: 8192,
  }),
  // DeepSeek R1 系列 (Reasoning)
  buildModelDefinition({
    id: "deepseek-reasoner",
    name: "DeepSeek R1",
    input: ["text"],
    contextWindow: 65536,
    maxTokens: 8192,
    reasoning: true,
  }),
];

const deepseekPlugin = {
  id: "deepseek-auth",
  name: "DeepSeek (深度求索)",
  description: "API key authentication for DeepSeek models",
  configSchema: emptyPluginConfigSchema(),
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/deepseek",
      aliases: ["ds"],
      envVars: ["DEEPSEEK_API_KEY"],
      models: {
        baseUrl: DEFAULT_BASE_URL,
        api: "openai-completions",
        models: MODELS,
      },
      auth: [
        {
          id: "api-key",
          label: "DeepSeek API Key",
          hint: "Enter your DeepSeek API key",
          kind: "api_key",
          run: async (ctx) => {
            const key = await ctx.prompter.text({
              message: "Enter your DeepSeek API key",
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
                      models: MODELS,
                    },
                  },
                },
                agents: {
                  defaults: {
                    models: {
                      "deepseek/deepseek-chat": { alias: "DeepSeek V3" },
                      "deepseek/deepseek-reasoner": { alias: "DeepSeek R1" },
                    },
                  },
                },
              },
              defaultModel: DEFAULT_MODEL,
              notes: [
                "DeepSeek API key configured successfully.",
                `Default model set to ${DEFAULT_MODEL}.`,
                "Get your API key at: https://platform.deepseek.com/",
              ],
            };
          },
        },
      ],
    });
  },
};

export default deepseekPlugin;
