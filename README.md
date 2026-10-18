# cs-im-demo-frontend

CS IM 的联调 Demo，独立于后端和正式 Web 工程，用于验证业务渠道与转发渠道的基础链路。

这不是正式前端，仅提供最小交互界面和后端代理。

## 页面

| 路径 | 用途 |
| --- | --- |
| `/` | 业务渠道 Demo：创建/接入 App、建立会话、发送客户消息、订阅客服消息 |
| `/relay` | 转发渠道 Demo：发送客服消息、订阅客户消息、查询会话消息 |

## 启动

需要 Node.js 20+。

```bash
npm run dev
```

默认访问 `http://localhost:3100`。

默认代理目标为 `http://127.0.0.1:8080`。如需调整：

```bash
CS_IM_BACKEND_URL=http://127.0.0.1:8080 npm run dev
PORT=3100 npm run dev
```

## 代理

`server.mjs` 会代理以下前缀到后端：

```text
/api/
/admin/
/ws/
```

Demo 使用开发 Token：

- 业务渠道：`dev-access-token`
- 转发渠道：`dev-relay-token`

## 使用流程

1. 启动 `cs-im-server`。
2. 打开 `/`，注册或连接业务 App，进入会话并发送客户消息。
3. 打开 `/relay`，输入同一个会话 ID，查看客户消息并回复客服消息。
4. 回到 `/` 验证客服消息能通过实时订阅收到。
5. 刷新页面时可通过历史消息接口找回既有会话记录。

## 仓库边界

只维护联调页面、静态资源和本地代理，不承载业务 SDK、UI 组件库或正式产品逻辑。
