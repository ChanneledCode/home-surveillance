const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = 'your-secret-key';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Validate credentials
  if (username === 'client_user' && password === 'client_pass') {
    const token = jwt.sign({ username }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;