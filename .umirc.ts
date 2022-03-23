import { join } from 'path';

const logo = 'https://cdn.jsdelivr.net/gh/wangxingkang/pictures@latest/imgs/20210623172110.svg';

export default {
  mode: 'site',
  title: 'Lotus Icons',
  dynamicImport: {},
  favicon: logo,
  logo,
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/lotus-fe/lotus-design-icons',
    },
  ],
  resolve: {
    includes: [
      "docs"
    ]
  },
  alias: {
    '@lotus-design/icons': join(__dirname, 'packages/react/src'),
    '@lotus-design/icons-svg/es': join(__dirname, 'packages/core/src'),
    '@lotus-design/icons-svg/lib': join(__dirname, 'packages/core/src'),
  },
  hash: true,
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
}
