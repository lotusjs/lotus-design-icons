import template from 'lodash/template';

import type { UseTemplatePluginOptions } from '../types';

export const useTemplate = ({
  template: tplContent,
  mapToInterpolate
}: UseTemplatePluginOptions) => {
  return ({ name, content }) => {
    const executor = template(tplContent);

    const result = executor(mapToInterpolate({ name, content }));

    return {
      name,
      content: result
    }
  }
};
