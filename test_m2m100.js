const { pipeline } = require('@xenova/transformers');

async function test() {
  try {
    const translator = await pipeline('translation', 'Xenova/m2m100_418M');
    const res = await translator('Hallo Welt', { src_lang: 'de', tgt_lang: 'en' });
    console.log('Result DE->EN:', res);
    const res2 = await translator('Hello world', { src_lang: 'en', tgt_lang: 'es' });
    console.log('Result EN->ES:', res2);
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
