#!/usr/bin/env node
/**
 * 初始化脚本：创建数据目录和空数据文件
 * 首次使用时运行：npm run init
 */
const fs = require('fs');
const path = require('path');

function getDataDir() {
  return process.env.RELATION_KEEPER_DATA || path.join(__dirname, '..', 'data');
}

function initDataDir() {
  const dataDir = getDataDir();
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const files = {
    'portraits.json': { people: {} },
    'past_events.json': { events: [] },
  };

  for (const [filename, content] of Object.entries(files)) {
    const filepath = path.join(dataDir, filename);
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, JSON.stringify(content, null, 2), 'utf-8');
    }
  }

  return dataDir;
}

function main() {
  const dataDir = initDataDir();
  console.log('✓ 数据目录已初始化:', dataDir);
}

if (require.main === module) main();
