function authenticateUser (req, res, next) {
  if (req.user == null) {
    res.status(403)
    return res.send('login first')
  }
}

module.exports = authenticateUser