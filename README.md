# AI SDK 中文文档

本项目用于维护 [Vercel AI SDK](https://github.com/vercel/ai) 文档的中文版本。

它会从官方仓库 `vercel/ai` 同步 `content/` 下的英文 MDX 文档到 `content/en`，计算文件 hash，并根据同步报告判断哪些中文文档需要新增、更新或提示删除。中文文档生成到 `content/zh`，站点使用 Rspress 和 Bun 渲染。

同步报告基于 `metadata/translation-state.json` 判断中文文档最后一次成功翻译对应的英文 hash。`docs:sync` 只生成英文内容和报告，不推进翻译状态；`docs:translate` 只有在单个文件翻译、校验、写入都成功后，才更新该文件的翻译状态。

`content/` 和 `scripts/` 是内容与同步翻译流程的边界，站点兼容逻辑放在 `rspress.config.ts` 和 `theme/` 下，不直接改写内容文件。

## 配置环境变量

复制示例配置：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_API_KEY=你的 API Key
OPENAI_MODEL_ID=deepseek-chat
```

可选配置：

```env
OPENAI_MAX_TOKENS=120000
TRANSLATE_LIMIT=10
TRANSLATE_CONCURRENCY=3
TRANSLATE_DRY_RUN=1
```

## 执行流程

安装依赖：

```bash
bun install
```

同步官方英文文档并生成变更报告：

```bash
bun run docs:sync
```

翻译新增、变更、缺失的中文文档：

```bash
bun run docs:translate
```

校验中文 MDX：

```bash
bun run docs:validate
```

启动本地站点：

```bash
bun run dev
```

默认访问：

```text
http://localhost:5173/docs/introduction
```

构建静态站点：

```bash
bun run build
```

构建产物输出到 `dist/`。

本地预览构建结果：

```bash
bun run start
```

<!-- sync-info:start -->
最近同步：2026/08/07 15:47:35（上游 commit: `15dce62`）
<!-- sync-info:end -->
