function handleErr(err, req, res, next) {
  res.status(400).json({ msg: err.message });
}

module.exports = handleErr;
