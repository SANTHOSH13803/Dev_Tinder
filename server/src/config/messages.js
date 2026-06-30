const successResponse = ({
  res,
  data = null,
  message = "Success",
  statusCode = 200,
  ...props
}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...props
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
