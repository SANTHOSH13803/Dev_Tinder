// utils/user.dto.js

const { pickFields } = require("./fields");

const toUserDto = (user) => pickFields(user.toObject ? user.toObject() : user);

module.exports = { toUserDto };
