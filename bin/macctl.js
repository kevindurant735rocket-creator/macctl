#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';

const cmd = process.argv[2];
const args = process.argv.slice(3);

function run(c, opts = {}) {
  try { return execSync(c, { encoding: 'utf-8', timeout: 30000, ...opts }).trim(); }
  catch (e) { return `✗ ${e.message.slice(0, 200)}`; }
}

function help() {
  console.log(`
macctl — macOS AI agent toolkit

  批处理 (省token核心):
     batch   <"cmd1 && cmd2 && ...">  一次执行多条命令, 合并输出

  macOS 自动化:
     app     <name>       打开/切换到应用
     say     <text>       TTS 朗读
     notify  <title> <body>  桌面通知
     clip    [text]       读取/写入剪贴板
     key     <key>        模拟按键

  效率工具:
     trim    <file> [lines]  截取文件中间部分,省token
     sys                   系统概览
     info   <name>        搜索工具
`);
}

switch (cmd) {
  case 'batch': {
    if (!args[0]) { console.log('用法: batch "cmd1 && cmd2"'); break; }
    const start = Date.now();
    const result = run(args.join(' '));
    console.log(`⚡ (${Date.now()-start}ms):\n${result}`);
    break;
  }
  case 'app': {
    if (!args[0]) break;
    run(`osascript -e 'tell application "${args[0]}" to activate'`);
    console.log(`✓ ${args[0]}`);
    break;
  }
  case 'say': {
    if (!args[0]) break;
    run(`say "${args.join(' ')}"`);
    console.log(`✓ "${args.join(' ').slice(0,40)}"`);
    break;
  }
  case 'notify': {
    if (args.length < 2) break;
    run(`osascript -e 'display notification "${args.slice(1).join(' ')}" with title "${args[0]}"'`);
    console.log('✓');
    break;
  }
  case 'clip': {
    if (args.length === 0) console.log(run('pbpaste'));
    else { run(`echo "${args.join(' ').replace(/"/g,'\\"')}" | pbcopy`); console.log('✓'); }
    break;
  }
  case 'key': {
    if (!args[0]) break;
    const m = { 'cmd+space':'command + space','cmd+c':'command + c','cmd+v':'command + v','enter':'return','esc':'escape','up':'up','down':'down' };
    const k = m[args[0]] || args[0];
    run(`osascript -e 'tell application "System Events" to keystroke "${k}"'`);
    console.log(`✓ ${args[0]}`);
    break;
  }
  case 'trim': {
    if (!args[0]) break;
    const file = resolve(args[0]);
    const maxLines = parseInt(args[1]) || 50;
    if (!existsSync(file)) { console.log('✗ 不存在'); break; }
    const lines = readFileSync(file,'utf-8').split('\n');
    if (lines.length <= maxLines) { console.log(readFileSync(file,'utf-8')); break; }
    const head = Math.floor(maxLines * 0.4);
    const tail = maxLines - head;
    console.log(`📄 ${lines.length}行→${maxLines}行:\n`);
    console.log(lines.slice(0,head).join('\n'));
    console.log(`\n... ${lines.length-head-tail}行省略 ...\n`);
    console.log(lines.slice(-tail).join('\n'));
    break;
  }
  case 'sys': {
    const cpu = run("top -l 1 -n 0 | grep 'CPU usage'");
    const disk = run("df -h / | tail -1 | awk '{print $3\"/\"$2\" (\"$5\")\"}'");
    const up = run("uptime | sed 's/.*up //' | sed 's/,.*//'");
    console.log(`💻 ARM64\n   CPU: ${cpu.slice(0,80)}\n   磁盘: ${disk}\n   运行: ${up}`);
    break;
  }
  case 'info': {
    if (!args[0]) break;
    const r = run(`which ${args[0]} 2>/dev/null && ${args[0]} --version 2>/dev/null || echo not found`);
    console.log(`🔍 ${args[0]}: ${r.split('\n')[0]}`);
    break;
  }
  default: help();
}
