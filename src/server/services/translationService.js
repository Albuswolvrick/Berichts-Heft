const { pipeline } = require('@xenova/transformers');
const LanguageDetect = require('languagedetect');

const lngDetector = new LanguageDetect();

/**
 * TranslationService singleton class.
 * Manages the initialization and caching of the Hugging Face transformers pipeline.
 * It uses the M2M100 418M parameter model to provide offline translation capabilities.
 */
class TranslationService {
  /**
   * The pipeline task type.
   * @type {string}
   */
  static task = 'translation';

  /**
   * The Hugging Face model identifier to be used for the translation task.
   * @type {string}
   */
  static model = 'Xenova/m2m100_418M';

  /**
   * Cached instance of the translation pipeline.
   * @type {Function|null}
   */
  static instance = null;

  /**
   * Retrieves the translation pipeline instance, initializing it if necessary.
   *
   * @param {Function} [progress_callback=null] - Optional callback to track the model download progress.
   * @returns {Promise<Function>} A promise that resolves to the translation pipeline instance.
   */
  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

/**
 * Mapping of languages detected by languagedetect to the 2-letter codes required by M2M100.
 * @type {Object<string, string>}
 */
const m2m100LangMap = {
  english: 'en',
  german: 'de',
  french: 'fr',
  chinese: 'zh',
  arabic: 'ar',
  hindi: 'hi',
  dutch: 'nl',
  latin: 'la',
  russian: 'ru',
  ukrainian: 'uk',
  swedish: 'sv',
  spanish: 'es',
  irish: 'ga',
};

/**
 * Translates the provided text to the target language.
 * If the source language is not provided, it attempts to detect it automatically.
 *
 * @param {string} text - The input text to be translated.
 * @param {string} targetLang - The 2-letter language code representing the target language.
 * @param {string|null} [sourceLang=null] - The 2-letter language code representing the source language. Defaults to null for auto-detection.
 * @returns {Promise<string>} A promise that resolves to the translated text. Returns original text on failure.
 */
async function translateText(text, targetLang, sourceLang = null) {
  if (!text || text.trim() === '') return text;

  if (!sourceLang) {
    const detected = lngDetector.detect(text, 1);
    if (detected && detected.length > 0) {
      const langName = detected[0][0].toLowerCase();
      sourceLang = m2m100LangMap[langName] || 'en';
    } else {
      sourceLang = 'en';
    }
  }

  const translator = await TranslationService.getInstance();
  const options = {
    src_lang: sourceLang,
    tgt_lang: targetLang,
  };

  try {
    const res = await translator(text, options);
    return res[0].translation_text;
  } catch (error) {
    console.error('Translation error encountered during pipeline execution:', error);
    return text; // Return the original text as a safe fallback
  }
}

module.exports = { translateText };
