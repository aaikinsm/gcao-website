import mysql from "mysql2/promise";

type GlobalPool = typeof globalThis & {
  mysqlPool?: mysql.Pool;
};

function createPool() {
  return mysql.createPool({
    host: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
  });
}

export function getPool() {
  const g = globalThis as GlobalPool;
  if (!g.mysqlPool) {
    g.mysqlPool = createPool();
  }
  return g.mysqlPool;
}
