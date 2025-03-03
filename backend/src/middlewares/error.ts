export const errorMiddleware = (
  //   err: Error,
  err,
  req,
  res,
  next,
) => {
  err.message || (err.message = "Internal Server Error");
  err.statusCode || (err.statusCode = 500); // if err.statusCode availabe then take err.statusCode else 500
  // if(err.name === "CastError") err.message = "Invalid ID"
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
export const TryCatch = (func) => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(next); // catch next means last error middleware passed to app.ts
};
