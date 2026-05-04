function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (req.accepts("html")) {
    return res.status(status).render("pages/error", {
      title: "Error",
      status,
      message,
    });
  }

  return res.status(status).json({ error: message });
}

module.exports = errorHandler;
