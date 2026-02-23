import { Op } from "sequelize";

// Comparison
const adults = await User.findAll({
  where: {
    age: { [Op.gte]: 18 } // >= 18
  }
});

const range = await User.findAll({
  where: {
    age: {
      [Op.gte]: 18,
      [Op.lte]: 65
    }
  }
});

// IN / NOT IN
const roles = await User.findAll({
  where: {
    role: { [Op.in]: ["admin", "moderator"] }
  }
});

const excluded = await User.findAll({
  where: {
    role: { [Op.notIn]: ["banned", "suspended"] }
  }
});

// LIKE (pattern matching)
const nameStartsWithJ = await User.findAll({
  where: {
    name: { [Op.like]: "J%" } // Starts with J
  }
});

const containsOe = await User.findAll({
  where: {
    name: { [Op.iLike]: "%oe%" } // Case-insensitive (PostgreSQL)
  }
});

// Logical operators
const adminsOrSeniors = await User.findAll({
  where: {
    [Op.or]: [{ role: "admin" }, { age: { [Op.gte]: 60 } }]
  }
});

const activeAdmins = await User.findAll({
  where: {
    [Op.and]: [{ role: "admin" }, { isActive: true }]
  }
});

// NOT
const notAdmin = await User.findAll({
  where: {
    role: { [Op.ne]: "admin" } // Not equal
  }
});

// IS NULL / IS NOT NULL
const withoutBio = await User.findAll({
  where: {
    bio: { [Op.is]: null }
  }
});

const withBio = await User.findAll({
  where: {
    bio: { [Op.not]: null }
  }
});

// BETWEEN
const midAge = await User.findAll({
  where: {
    age: { [Op.between]: [30, 50] }
  }
});

// Complex queries
const complex = await User.findAll({
  where: {
    [Op.or]: [
      {
        [Op.and]: [{ role: "admin" }, { isActive: true }]
      },
      {
        age: { [Op.gte]: 65 }
      }
    ]
  }
});