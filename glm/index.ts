import { emptyPluginConfigSchema } from "clawdbot/plugin-sdk";

const PROVIDER_ID = "glm";
const PROVIDER_LABEL = "智谱 GLM";
const DEFAULT_MODEL = "glm/glm-4.7";
const DEFAULT_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
const DEFAULT_CONTEXT_WINDOW = 128000;
const DEFAULT_MAX_TOKENS = 4096;

function buildModelDefinition(params: {
  id: string;
  name: string;
  input: Array<"text" | "image">;
  contextWindow?: number;
  maxTokens?: number;
}) {
  return {
    id: params.id,
    name: params.name,
    reasoning: false,
    input: params.input,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: params.contextWindow ?? DEFAULT_CONTEXT_WINDOW,
    maxTokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
  };
}

const glmPlugin = {
  id: "glm-auth",
  name: "智谱 GLM",
  description: "API key authentication for 智谱 GLM models",
  configSchema: emptyPluginConfigSchema(),
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/glm",
      aliases: ["zhipu", "bigmodel"],
      envVars: ["GLM_API_KEY", "ZHIPU_API_KEY"],
      models: {
        baseUrl: DEFAULT_BASE_URL,
        api: "openai-completions",
        models: [
          buildModelDefinition({
            id: "glm-4.7",
            name: "GLM-4.7",
            input: ["text", "image"],
            contextWindow: 128000,
            maxTokens: 4096,
          }),
        ],
      },
      auth: [
        {
          id: "api-key",
          label: "GLM API Key",
          hint: "Enter your 智谱 API key",
          kind: "api_key",
          run: async (ctx) => {
            const key = await ctx.prompter.text({
              message: "Enter your 智谱 GLM API key",
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
                        buildModelDefinition({
                          id: "glm-4.7",
                          name: "GLM-4.7",
                          input: ["text", "image"],
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
                      "glm/glm-4.7": { alias: "GLM" },
                    },
                  },
                },
              },
              defaultModel: DEFAULT_MODEL,
              notes: [
                "智谱 GLM API key configured successfully.",
                `Default model set to ${DEFAULT_MODEL}.`,
                "Get your API key at: https://open.bigmodel.cn/",
              ],
            };
          },
        },
      ],
    });
  },
};

export default glmPlugin;
