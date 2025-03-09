import { languageType } from './enum';

const getLanguageById = (languageId?: number) => {

  if (languageId === 1) return languageType.MARATHI;
  if (languageId === 2) return languageType.HINDI;
  return null;
};

export {
  getLanguageById
};