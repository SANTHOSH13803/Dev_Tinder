const USER_ALLOWED_FIELDS =
  "firstName lastName age photoURL skills about gender _id";
const pickFields = (obj, fields = USER_ALLOWED_FIELDS) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => fields.includes(key))
  );
};

const PHOTO_ALLOWED_FILEDS = "userId url createdAt _id";

module.exports = { USER_ALLOWED_FIELDS, pickFields, PHOTO_ALLOWED_FILEDS };
