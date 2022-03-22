import {
  unless,
  map,
  pipe,
  clone,
  reduce,
  filter,
  both,
  where,
  length,
  applyTo,
  equals,
  __,
  dissoc as deleteProp,
  gt as greaterThan,
} from 'ramda';

import type { XML2AbstractNodeOptions, TransformFactory, AbstractNode } from '../types';

export function element2AbstractNode({
  name,
  theme,
  extraNodeTransformFactories
}: XML2AbstractNodeOptions) {
  return ({ name: tag, attributes, children }: Record<string, any>) => {
    return applyTo(extraNodeTransformFactories)(
      pipe(
        map((factory: TransformFactory) => factory({ name, theme })),
        reduce(
          (transformedNode, extraTransformFn) =>
          extraTransformFn(transformedNode),
          applyTo({
            tag,
            attrs: clone(attributes),
            children: applyTo(children as Element[])(
              pipe(
                filter<Element, 'array'>(where({ type: equals('element') })),
                map(
                  element2AbstractNode({
                    name,
                    theme,
                    extraNodeTransformFactories
                  })
                )
              )
            )
          })(
            unless<AbstractNode, AbstractNode>(
              where({
                children: both(Array.isArray, pipe(length, greaterThan(__, 0)))
              }),
              deleteProp('children')
            )
          )
        )
      )
    )
  }
}
