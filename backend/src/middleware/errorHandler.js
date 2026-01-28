const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.entries(err.errors).map(([field, e]) => ({
      field,
      message: e.message,
    }));
    return res.status(400).json({
      message: 'Validation Error',
      errors,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      message: 'Invalid ID format',
    });
  }

  // Mongoose cast error (e.g. invalid date/number)
  if (err.name === 'CastError' && err.kind !== 'ObjectId') {
    return res.status(400).json({
      message: 'Invalid value',
      errors: [
        {
          field: err.path || 'unknown',
          message: err.message || 'Invalid value',
        },
      ],
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
