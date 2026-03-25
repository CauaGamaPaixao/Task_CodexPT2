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

    console.error('External data service read error:', error.message);
    throw error;
  }
}

async function logActivity(activity) {
  try {
    const logs = await readLogs();
    const entry = {
      id: logs.length + 1,
      ...activity,
    };

    logs.push(entry);
    await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
    return entry;
  } catch (error) {
    console.error('External data service write error:', error.message);
    throw error;
  }
}

module.exports = {
  readLogs,
  logActivity,
};
