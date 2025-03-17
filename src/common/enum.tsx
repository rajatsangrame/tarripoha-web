const USER_ROLE_TYPE = {
  ADMIN: {
    name: 'ADMIN', value: 1
  },
  USER: {
    name: 'USER', value: 1
  },
  EDITOR: {
    name: 'EDITOR', value: 1
  },
  GUEST: {
    name: 'GUEST', value: 1
  }
};

const LANGUAGE_TYPE = {
  MARATHI: {
    id: 1,
    name: 'Marathi',
    value: 'मराठी',
    symbol: 'म',
  },
  HINDI: {
    id: 2,
    name: 'Hindi',
    value: 'हिन्दी',
    symbol: 'हिं',
  },
};

const CONTENT_TYPE = {
  WORD: {
    name: 'WORD',
    value: 1,
  },
  COMMENT: {
    name: 'WORD',
    value: 2,
  },
  PHRASE: {
    name: 'PHRASE',
    value: 3,
  },
  AD_DEFAULT: {
    name: 'AD_DEFAULT',
    value: 4,
  },
  MERCH_DEFAULT: {
    name: 'MERCH_DEFAULT',
    value: 5,
  },

};

export { USER_ROLE_TYPE, LANGUAGE_TYPE, CONTENT_TYPE };
