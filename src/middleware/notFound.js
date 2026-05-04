function notFound(req, res) {
  if (req.accepts("html")) {
    return res.status(404).render("pages/not-found", { title: "Not Found" });
  }

  return res.status(404).json({ error: "Not found" });
}

module.exports = notFound;
