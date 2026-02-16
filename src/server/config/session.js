const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const { env } = require('./env');

/**
 * Creates the Express session middleware with SQLite store.
 */
function createSessionMiddleware() {
  return session({
    store: new SQLiteStore({
      db: 'sessions.db',
      dir: './',
    }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  });
}

module.exports = { createSessionMiddleware };
