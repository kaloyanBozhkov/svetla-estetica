module.exports = {
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        '^~(.*)$': '<rootDir>/src/$1',
        '^@asset(.*)$': ['<rootDir>/public/assets/$1'],
        '^components(.*)$': ['<rootDir>/src/components/$1'],
        '^helpers(.*)$': ['<rootDir>/src/helpers/$1'],
        '^hooks(.*)$': ['<rootDir>/src/hooks/$1'],
    },
    rootDir: '.',
    roots: ['<rootDir>', '<rootDir>/src'],
}
