// jest.config.js
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js', '<rootDir>/src/tests/cleanup.js'],
    testMatch: [
        '<rootDir>/src/tests/**/*.test.js',
        '<rootDir>/src/tests/**/*.spec.js',
        '<rootDir>/src/tests/**/*.test.ts',
        '<rootDir>/src/tests/**/*.spec.ts'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '**/src/**/*.js',
        '**/src/**/*.ts'
    ],
    // Options pour ignorer certains fichiers
    testPathIgnorePatterns: [
        "/node_modules/", 
        "/dist/"
    ],
    moduleFileExtensions: ['js', 'json', 'ts']
};

