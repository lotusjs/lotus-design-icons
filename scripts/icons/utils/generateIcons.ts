import path from 'path';
import {
  pipe,
  map,
  applyTo,
} from 'ramda';
import { glob, fsExtra } from '@walrus/cli-utils';

import { svgo } from '../svgo';
import { generalConfig } from '../svgo/presets';

import { svg2Definition } from './svg2Definition';
import { useTemplate } from './useTemplate';

import type { OptimizeOptions } from 'svgo';
import type { SVG2DefinitionOptions, UseTemplatePluginOptions } from '../types';

interface Options extends
  SVG2DefinitionOptions,
  UseTemplatePluginOptions
{
  from: string;
  toDir: string;
  svgoConfig?: OptimizeOptions;
  filename: (option: { name: string }) => string;
}

export async function generateIcons({
  theme,
  from,
  toDir,
  template,
  extraNodeTransformFactories,
  svgoConfig = generalConfig,
  stringify,
  mapToInterpolate,
  filename,
}: Options) {
  applyTo(glob.sync(from))(
    pipe(map((svg: string) => {
      const svgStr = svgo(fsExtra.readFileSync(svg), svgoConfig);

      const svgName = path.parse(svg).name;

      applyTo({
        name: svgName,
        content: svgStr,
      })(
        pipe(
          svg2Definition({
            theme,
            extraNodeTransformFactories,
            stringify
          }),
          useTemplate({
            template,
            mapToInterpolate
          }),
          (() => {
            return ({ name, content }) => {
              const fileName = filename({ name });

              return {
                name: `${fileName}.ts`,
                content
              }
            }
          })(),
          (() => {
            return ({ name, content }) => {
              fsExtra.ensureDirSync(toDir);
              fsExtra.writeFileSync(path.join(toDir, name), content);
            }
          })()
        )
      )
    }))
  )
}
