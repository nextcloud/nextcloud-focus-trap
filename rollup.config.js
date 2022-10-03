import { nodeResolve } from '@rollup/plugin-node-resolve'
import clean from '@rollup-extras/plugin-clean';
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { dependencies } from './package.json'

const config = output => ({
  input: './lib/index.ts',
  external: Object.keys(dependencies),
  plugins: [
    nodeResolve(),
    typescript({
      compilerOptions: output.format === 'cjs'
        ? { target: 'es5' }
        : {},
    }),
    commonjs(),
    clean(),
  ],
  output: [output],
})

export default [
  {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true,
  },
  {
    file: 'dist/index.esm.js',
    format: 'esm',
    sourcemap: true,
  },
].map(config)