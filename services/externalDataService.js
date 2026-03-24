const fs = require('fs/promises');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'integration_logs.json');

async function readLogs() {
  try {
    const raw = await fs.readFile(LOG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function logActivity(activity) {
  const logs = await readLogs();
  const entry = {
    id: logs.length + 1,
    timestamp: new Date().toISOString(),
    ...activity,
  };

  logs.push(entry);
  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
  return entry;
}

module.exports = {
  readLogs,
  logActivity,
};
