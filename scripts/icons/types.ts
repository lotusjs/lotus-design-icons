export type SvgTheme = 'filled' | 'outlined' | 'twotone';

export interface AbstractNodeDefinition {
  name: string;
  theme: SvgTheme;
  icon: AbstractNode;
}

export interface AbstractNode {
  tag: string;
  attrs: {
    [key: string]: string;
  };
  children?: AbstractNode[];
}

export interface StringifyFn {
  (icon: AbstractNodeDefinition): string;
}

export interface SVG2DefinitionOptions {
  theme: SvgTheme;
  extraNodeTransformFactories: TransformFactory[];
  stringify?: StringifyFn;
}

export interface XML2AbstractNodeOptions extends SVG2DefinitionOptions {
  name: string;
}

export type TransformOptions = Pick<XML2AbstractNodeOptions, 'name' | 'theme'>;

export interface TransformFactory {
  (options: TransformOptions): (asn: AbstractNode) => AbstractNode;
}

export interface UseTemplatePluginOptions {
  template: string;
  mapToInterpolate: MapToInterpolate;
}

export interface MapToInterpolate {
  (meta: { name: string; content: string; path?: string }): object;
}

