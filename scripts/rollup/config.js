const pkg = require('../../package.json');
const babel = require('rollup-plugin-babel');
const { eslint } = require("rollup-plugin-eslint");

const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const globals = require('rollup-plugin-node-globals');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');

const builds = {
  'dev-umd': {
    input: 'src/index.js',
    output: pkg.browser,
    format: 'umd'
  },
  'dev-cjs': {
    input: 'src/index.js',
    output: pkg.main,
    format: 'cjs'
  },
  'dev-esm': {
    input: 'src/index.js',
    output: pkg.module,
    format: 'esm'
  },
  'prod-umd': {
    input: 'src/index.js',
    output: genMinFileName(pkg.browser),
    format: 'umd'
  },
  'prod-cjs': {
    input: 'src/index.js',
    output: genMinFileName(pkg.main),
    format: 'cjs'
  },
  'prod-esm': {
    input: 'src/index.js',
    output: genMinFileName(pkg.module),
    format: 'esm'
  },
}

function genMinFileName(fileName) {
  let arr = fileName.split('.')
  arr.splice(arr.length - 1, 0, 'min')
  return arr.join('.')
}

function genConfig(name, isDev = false) {
  const opts = builds[name]
  const config = {
    input: opts.input,
    output: {
      file: (isDev ? 'example/' : '') + opts.output,
      format: opts.format,
      name: opts.moduleName || 'Topor'
    },
    plugins: [
      resolve(),
      commonjs(),
      globals(),
      eslint(),
      babel({
        exclude: 'node_modules/**'
      })
    ].concat(
      isDev
        ? [
          serve({
            open: true,
            openPage: '/',
            contentBase: ['example'],
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }),
          livereload({
            watch: ['example'],
          })
        ]
        : []
    ),
  }

  return config
}

function genProdConfig(name) {
  return genConfig(name, false)
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET, true)
} else {
  exports.getBuild = genProdConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genProdConfig)
}