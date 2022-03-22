import { optimize } from 'svgo';

import type { OptimizeOptions, OptimizedSvg } from 'svgo';

export const svgo = (svgString: string | Buffer, options: OptimizeOptions) => {
  const { data } = optimize(svgString, options) as OptimizedSvg;

  return data;
};
