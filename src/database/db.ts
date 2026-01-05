import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('krono.db');
  await initDatabase(db);
  return db;
};

const initDatabase = async (database: SQLite.SQLiteDatabase) => {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      platformId TEXT NOT NULL,
      username TEXT NOT NULL,
      displayName TEXT,
      avatar TEXT,
      rating INTEGER,
      maxRating INTEGER,
      rank TEXT,
      problemsSolved INTEGER DEFAULT 0,
      totalSubmissions INTEGER DEFAULT 0,
      badges TEXT, -- JSON stringified
      lastUpdated INTEGER,
      isStale INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contests (
      id TEXT PRIMARY KEY,
      externalId TEXT,
      platformId TEXT NOT NULL,
      name TEXT NOT NULL,
      startTime INTEGER NOT NULL,
      endTime INTEGER NOT NULL,
      durationSeconds INTEGER,
      url TEXT,
      isRated INTEGER DEFAULT 0,
      phase TEXT,
      reminderSet INTEGER DEFAULT 0,
      scheduledReminders TEXT -- JSON stringified
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
};
