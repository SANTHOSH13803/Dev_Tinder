const USER_ALLOWED_FIELDS =
  "firstName lastName age photoURL skills about gender";
const pickFields = (obj, fields = USER_ALLOWED_FIELDS) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => fields.includes(key))
  );
};
module.exports = { USER_ALLOWED_FIELDS, pickFields };
