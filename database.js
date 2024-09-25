const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
   
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        userId TEXT,
        title TEXT,
        description TEXT,
        status TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`
    );
  }
});

module.exports = db;
