const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/verify-captcha", async (req, res) => {
  const { token } = req.body;

  const secretKey = "6LexLC0rAAAAAHs1GfUiGCF4NbHeNbQNTm2hS4co";
  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

  try {
    const response = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: token,
      },
    });

    if (response.data.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: response.data["error-codes"] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: "Serverio klaida" });
  }
});

module.exports = router;
