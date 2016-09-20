var sqlite = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

// TODO: look into either mongo or redis instead of sqlite
