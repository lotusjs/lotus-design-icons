
import path from 'path';
import prettier from 'prettier';
import { pipe, applyTo, } from 'ramda';
import { rimraf, logger, fsExtra, glob } from '@walrus/cli-utils';

import { generateIcons } from './utils/generateIcons';
import { assignAttrsAtTag } from './utils/assignAttrsAtTag';

import { getIdentifier } from '../utils';

const CORE_DIR = path.join(__dirname, '../../packages/core');
const SVG_DIR = path.join(CORE_DIR, 'svg');
const FILLED_SVG_DIR = path.join(SVG_DIR, 'filled');

const cleanDirs = ['src', 'inline-svg', 'es', 'lib'];

const iconTemplate = fsExtra.readFileSync(
  path.resolve(CORE_DIR, 'templates/icon.ts.ejs'),
  'utf8'
);

(async () => {
  logger.info('start');

  // 1. clean
  logger.info('clean');
  cleanDirs.forEach((cleanDir) => {
    rimraf.sync(path.join(CORE_DIR, cleanDir))
  });

  // 2. copy helpers.ts, types.ts
  glob.sync(path.join(CORE_DIR, 'templates/*.ts')).forEach((value) => {
    fsExtra.copySync(value, path.join(CORE_DIR, `src/${path.basename(value)}`));
  })

  // 3. generate abstract node with the theme "filled"
  await generateIcons({
    theme: 'filled',
    from: `${FILLED_SVG_DIR}/*.svg`,
    toDir: `${CORE_DIR}/src/asn`,
    extraNodeTransformFactories: [
      assignAttrsAtTag('svg', { focusable: 'false' })
    ],
    stringify: JSON.stringify,
    template: iconTemplate,
    mapToInterpolate: ({ name, content }) => ({
      identifier: getIdentifier({ name, themeSuffix: 'Filled' }),
      content
    }),
    filename: ({ name }) => getIdentifier({ name, themeSuffix: 'Filled' })
  });

  // 4.format
  logger.info('format code');
  const configFile = await prettier.resolveConfigFile();
  const prettierOpts = await prettier.resolveConfig(configFile);

  glob.sync(path.join(`${CORE_DIR}/src/**/*.*`))
    .forEach(file => {
      applyTo(file)(
        pipe(
          (() => {
            return (file) => {
              return fsExtra.readFileSync(file).toString();
            }
          })(),
          (() => {
            return (code) => {
              return prettier.format(code, { ...prettierOpts, parser: 'babel' });
            }
          })(),
          (() => {
            return (code) => {
              fsExtra.writeFileSync(file, code);
            }
          })(),
        )
      )
    });

  logger.info('end');
})()
