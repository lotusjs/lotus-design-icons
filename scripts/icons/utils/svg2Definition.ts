import parseXML from '@rgrove/parse-xml';
import {
  pipe,
  applyTo,
  objOf,
  path as get,
  assoc,
  defaultTo,
} from 'ramda';

import { element2AbstractNode } from './element2AbstractNode'

import type { XmlDocument } from '@rgrove/parse-xml';
import type { SVG2DefinitionOptions } from '../types';

export function svg2Definition({
  theme,
  extraNodeTransformFactories,
  stringify,
}: SVG2DefinitionOptions) {
  return ({ name, content }) => {
    const svgStr = applyTo(content)(
      pipe(
        // 0. The SVG string is like that:
        // <svg viewBox="0 0 1024 1024"><path d="..."/></svg>

        parseXML,

        // 1. The parsed XML root node is with the JSON shape:
        // {
        //   "type": "document",
        //   "children": [
        //     {
        //       "type": "element",
        //       "name": "svg",
        //       "attributes": { "viewBox": "0 0 1024 1024" },
        //       "children": [
        //         {
        //           "type": "element",
        //           "name": "path",
        //           "attributes": {
        //             "d": "..."
        //           },
        //           "children": []
        //         }
        //       ]
        //     }
        //   ]
        // }

        get<XmlDocument>(['children', 0]),

        // 2. The element node is with the JSON shape:
        // {
        //   "type": "element",
        //   "name": "svg",
        //   "attributes": { "viewBox": "0 0 1024 1024" },
        //   "children": [
        //     {
        //       "type": "element",
        //       "name": "path",
        //       "attributes": {
        //         "d": "..."
        //       },
        //       "children": []
        //     }
        //   ]
        // }

        element2AbstractNode({
          name,
          theme,
          extraNodeTransformFactories
        }),

        pipe(
          objOf('icon'),
          assoc('name', name),
          assoc('theme', theme)
        ),

        defaultTo(JSON.stringify)(stringify)
      )
    )

    return {
      name,
      content: svgStr,
    }
  }
}
