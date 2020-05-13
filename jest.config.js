module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
	globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
	setupFilesAfterEnv: ['./jest.setup.js']
};