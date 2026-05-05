const { getOrCreateUser } = require("../services/user.service");

async function attachDbUser(req, res, next) {
  try {
    if (!req.user) {
      return next();
    }
    const dbUser = await getOrCreateUser(req.user);
    req.dbUser = dbUser;
    res.locals.dbUser = dbUser;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = attachDbUser;
