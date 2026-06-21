const express = require('express');
const { translateText } = require('../services/translationService');
const { isAuthenticated } = require('../middleware/auth');

/**
 * Express router mapping for translation-related endpoints.
 * @module routes/translation
 */
const router = express.Router();

/**
 * POST /api/translate
 * 
 * Handles the translation of a batch of text fields.
 * This endpoint implements Server-Sent Events (SSE) via a chunked response
 * to provide real-time translation progress updates to the client.
 *
 * @name Translate Route
 * @path {POST} /
 * @auth This route requires a valid user session.
 * @body {Object} texts - A key-value mapping of fields to be translated.
 * @body {string} targetLang - The 2-letter language code to translate into.
 * @body {string} [sourceLang] - The optional source language code.
 * @response {text/event-stream} Emits 'progress' and 'complete' events as JSON strings.
 */
router.post('/', isAuthenticated, async (req, res) => {
  const { texts, targetLang, sourceLang } = req.body;

  if (!texts || !targetLang) {
    return res.status(400).json({ error: 'texts and targetLang are required' });
  }

  // Establish SSE connection headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const translatedTexts = {};
    const entries = Object.entries(texts);
    const total = entries.length;

    // Process each text field sequentially to compute progress
    for (let i = 0; i < total; i++) {
      const [key, text] = entries[i];
      if (typeof text === 'string' && text.trim() !== '') {
        translatedTexts[key] = await translateText(text, targetLang, sourceLang);
      } else {
        translatedTexts[key] = text;
      }
      
      // Transmit the current completion percentage
      const progress = Math.round(((i + 1) / total) * 100);
      res.write(`data: ${JSON.stringify({ type: 'progress', progress })}\n\n`);
    }
    
    // Transmit the final assembled result and terminate the connection
    res.write(`data: ${JSON.stringify({ type: 'complete', translatedTexts })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Translation error in route:', error);
    res.status(500).json({ error: 'Failed to translate texts' });
  }
});

module.exports = router;
