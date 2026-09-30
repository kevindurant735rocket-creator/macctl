# macctl

Short macOS commands for agents that would otherwise burn tool calls.

One file, ~105 lines of Node, zero dependencies. A thin wrapper over `osascript`,
`pbcopy`/`pbpaste`, and a few `sh` pipelines.

## Real output

```
$ macctl batch "echo hello-from-macctl && date +%Y"
⚡ (8ms):
hello-from-macctl
2026

$ macctl sys
💻 ARM64
   CPU: CPU usage: 15.54% user, 15.40% sys, 69.4% idle
   磁盘: 287G/927G (31%)
   运行: 7 days

$ macctl info node
🔍 node: /opt/homebrew/bin/node

$ macctl trim sample.js 5
📄 11行→5行:

const express = require("express");
const app = express();

... 6行省略 ...

function handler(req, res) { res.send("hello"); }
module.exports = app;
```

## Install

```bash
npm install -g .
```

Requires Node 18+ (ESM) and macOS. Installs the `macctl` binary.

## Usage

```bash
macctl batch <"cmd1 && cmd2">        # run a chained shell command, one tool call
macctl app <name>                    # activate an app
macctl say <text>                    # TTS
macctl notify <title> <body>         # desktop notification
macctl clip [text]                   # read clipboard, or write text to it
macctl key <key>                     # simulate a keystroke
macctl trim <file> [lines]           # head+tail excerpt, default 50 lines
macctl sys                           # CPU / disk / uptime
macctl info <name>                   # locate a binary and print its version
```

Built-in key aliases: `cmd+space`, `cmd+c`, `cmd+v`, `enter`, `esc`, `up`,
`down`. Anything else is passed through as a keystroke string.

中文说明：`macctl` 给 macOS 上的 AI agent 提供短命令——`batch` 把多条 shell 命令
合成一次 tool call，`trim` 避免 agent 读整个文件，`sys`/`info` 替代多个探测命令。

## What this is not

- **Not an agent framework.** No loop, no tool registry, no retry, no MCP. It is
  nine shell one-liners.
- **The token saving is a claim, not a measurement.** Nothing here counts
  tokens. You save round-trips by issuing one command instead of several — that
  is the whole mechanism.
- **`sys` hardcodes `💻 ARM64`.** The architecture is a literal string, not read
  from the system. It will lie on Intel Macs.
- **Everything is `execSync` with string interpolation** into a shell command
  (30s timeout). Passing untrusted input to `app`, `say`, `notify`, `clip`, or
  `key` is a shell-injection hazard. There is no escaping layer, no allowlist,
  and no dry-run mode.
- **No exit codes.** Every failure prints `✓` anyway — `run()` swallows the
  error and returns it as a string, and callers ignore it. If you script
  against this, check output, not status.
- **`trim` reads the whole file into memory** before slicing, so it saves tokens,
  not memory.
- **`clip` with no args dumps the whole clipboard** — whatever is in there,
  including passwords, goes to stdout.
- **`key` and `app` need Accessibility permissions** granted to your terminal.
  Without it they fail silently (see above).
- macOS only. No tests, no config, no library API.

## Requirements

macOS, Node 18+, no runtime dependencies. Automation commands require
Accessibility permission for the invoking terminal.

## License

MIT