import { resolve } from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: 'ts-loader',
        exclude: [resolve(__dirname, 'node_modules')],
      },
    ],
  },
  externals: [{ 'utf-8-validate': 'commonjs utf-8-validate', bufferutil: 'commonjs bufferutil' }],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'bundle'),
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
};

export default config;
