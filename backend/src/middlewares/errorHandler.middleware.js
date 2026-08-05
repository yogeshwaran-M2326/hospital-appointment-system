function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err);
  
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error. Please try again later.'
  });
}

module.exports = errorHandler;
