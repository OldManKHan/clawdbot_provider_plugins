# Clawdbot Provider Plugins

本目录包含 Clawdbot 的第三方 AI 模型 Provider 插件。

## 可用插件

| 插件 | Provider ID | 支持模型 |
|------|-------------|----------|
| DeepSeek | `deepseek` | deepseek-chat (V3), deepseek-reasoner (R1) |
| GLM | `glm` | glm-4.7 |
| Kimi | `kimi` | kimi-k2.5, kimi-k2-thinking, moonshot-v1 系列 |

## 安装

1. 将插件目录复制到 Clawdbot 的 plugins 目录下：（可以根据需求选装或者都安装）

```bash
# 安装deepseek
cd deepseek
clawdbot plugins install ./

# 安装glm
cd glm
clawdbot plugins install ./

# 安装kimi
cd kimi
clawdbot plugins install ./

# 安装完成重启一次

# 重启当前运行的 gateway
clawdbot gateway restart

```


## 配置 API

1. 运行 Clawdbot 的认证配置命令，按提示输入 API Key：

```bash
clawdbot models auth login --provider kimi

clawdbot models auth login --provider glm

clawdbot models auth login --provider deepseek
```


## 重启 Gateway

配置完成后，需要重启 Clawdbot Gateway 使配置生效：

```bash
# 重启当前运行的 gateway
clawdbot gateway restart

```


## 使用模型

配置完成后，可以在 Clawdbot 中使用这些模型：

- 方式1，聊天记录中切换

```bash
# 使用 DeepSeek V3 (Chat)
/models  glm    展示供应商的模型列表

/model glm/glm-4.7  切换到glm-4.7模型

```

- 方式2， 命令行切换

```
 clawdbot config   #打开交互切换

 Model : skip for now

 All providers:  选择 glm/glm-4.7 模型， enter 切换
```

- 方式3， 修改配置文件

```
  cd  ~/.clawdbot/

  vim clawdbot.json

   anents ->  defaults -> model -> primary  修改这个值切换模型
```
