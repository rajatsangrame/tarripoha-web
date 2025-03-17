import { LANGUAGE_TYPE } from './enum';

const getLanguageById = (languageId?: number) => {

  if (languageId === 1) return LANGUAGE_TYPE.MARATHI;
  if (languageId === 2) return LANGUAGE_TYPE.HINDI;
  return null;
};

export {
  getLanguageById
};