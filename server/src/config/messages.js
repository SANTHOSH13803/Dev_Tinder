const successResponse = ({
  res,
  data = null,
  message = "Success",
  statusCode = 200
}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = ({
  res,
  error = "Something went wrong",
  statusCode = 500
}) => {
  return res.status(statusCode).json({
    success: false,
    error
  });
};

module.exports = {
  successResponse,
  errorResponse
};
