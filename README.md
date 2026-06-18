# macctl 🤖

macOS AI agent toolkit — 让 AI 高效操控 Mac，省 token。

## 安装

```bash
npm install -g .
```

## 功能

| 命令 | 用途 | 省token? |
|------|------|----------|
| `batch` | 多条命令一次执行 | ✅ 大幅减少 tool call |
| `trim` | 截取文件首尾 | ✅ 避免读整文件 |
| `app` | 打开/切换应用 | ✅ CLI 比 AppleScript 短 |
| `say` | TTS 朗读 | ✅ |
| `notify` | 桌面通知 | ✅ |
| `clip` | 剪贴板读写 | ✅ |
| `key` | 模拟按键 | ✅ |
| `sys` | 系统概览 | ✅ 替代多个命令 |
| `info` | 搜索工具 | ✅ |
