const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../../data.json');

exports.handler = async (event) => {
  try {
    const newData = JSON.parse(event.body);
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
