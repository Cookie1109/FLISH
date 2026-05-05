const { User } = require("../models");
const { seedUserTopics } = require("./seed.service");

function deriveUsername(firebaseUser, email) {
  if (firebaseUser?.name) return firebaseUser.name;
  return email.split("@")[0];
}

async function getOrCreateUser(firebaseUser) {
  const email = firebaseUser?.email;
  if (!email) {
    const error = new Error("Authenticated user email is required");
    error.status = 400;
    throw error;
  }

  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({
      username: deriveUsername(firebaseUser, email),
      email,
      passwordHash: null,
      role: "user",
    });
    
    // Auto-seed 3 sample topics for new users (run asynchronously in background)
    seedUserTopics(user.id).catch(console.error);
  }

  return user;
}

module.exports = { getOrCreateUser };
