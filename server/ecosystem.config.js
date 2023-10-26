module.exports = {
  apps: [
    {
      name: 'coderspace',
      script: './src/server.ts',
      interpreter: 'C:/Users/Marwan/AppData/Roaming/npm/ts-node.cmd',
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
};
