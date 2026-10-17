# CS IM Demo Frontend

独立的前端联调 Demo，不包含在任何后端工程里。

## 启动

```bash
npm run dev
```

默认访问：

```text
http://localhost:3100
```

默认代理到：

```text
http://127.0.0.1:8080
```

如需指定后端：

```bash
CS_IM_BACKEND_URL=http://127.0.0.1:8080 npm run dev
```

页面会依次调用：

1. `/admin/v1/apps/register`
2. `/admin/v1/apps/heartbeat`
3. `/api/v1/channels/:appId/conversations/ensure`
4. `/api/v1/channels/:appId/conversations/:conversationId`
5. `/api/v1/channels/:appId/messages`
6. `/api/v1/channels/:appId/conversations/:conversationId/messages`
7. `/api/v1/channels/:appId/realtime`
