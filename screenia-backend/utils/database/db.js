const mysql = require('mysql2/promise');
import { config } from "./config";

async function query(sql, params) {
  const connection = await mysql.createPool(config);
  const [results] = await connection.execute(sql, params);

  return results;
}

export {
  query
}