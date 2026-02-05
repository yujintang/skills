#!/usr/bin/env node
const { loadJson, saveJson, generateId } = require('./utils.js');

function loadPastEvents() {
  const data = loadJson('past_events');
  return data.events || [];
}

function addPastEvent(personIds, eventType, date, summary, details = '') {
  const evt = {
    id: generateId('pevt'),
    personIds,
    type: eventType,
    date,
    summary,
    details,
    createdAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  };
  const data = loadJson('past_events');
  const events = data.events || [];
  events.push(evt);
  saveJson('past_events', { events });
  return evt;
}

function queryPastByPerson(personName) {
  return loadPastEvents().filter((e) => (e.personIds || []).includes(personName));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const options = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      options[key] = args[i + 1] || true;
      if (args[i + 1] && !args[i + 1].startsWith('--')) i++;
    }
  }
  return { cmd, args: args.slice(1), options };
}

function main() {
  const { cmd, options } = parseArgs();
  const persons = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);

  if (cmd === 'add') {
    const evt = addPastEvent(
      persons(options.persons),
      options.type,
      options.date,
      options.summary,
      options.details || ''
    );
    console.log(JSON.stringify(evt, null, 2));
  } else if (cmd === 'query') {
    const person = options.person || process.argv[3];
    if (!person) {
      console.error('用法: node events.js query <姓名>');
      process.exit(1);
    }
    queryPastByPerson(person).forEach((e) => console.log(JSON.stringify(e)));
  } else {
    console.error('用法: node events.js <add|query> [选项]');
    console.error('  添加事件: node events.js add --persons "张三,李四" --type 吃饭 --date 2026-01-18 --summary "海底捞聚餐"');
    console.error('  查询事件: node events.js query --person 张三');
    process.exit(1);
  }
}

if (require.main === module) main();
