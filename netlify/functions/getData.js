const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../../data.json');

exports.handler = async () => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
