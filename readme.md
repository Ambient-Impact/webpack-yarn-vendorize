Copy front-end assets from [Yarn](https://yarnpkg.com/)'s virtual filesystem to
a publicly accessible vendor directory.

# Why?

If you're coming from the PHP world where [the Composer package
manager](https://getcomposer.org/) is the gold standard in managing
dependencies, and you're working with a CMS like
[Drupal](https://www.drupal.org/) that has its own system for managing various
libraries, handling dependency trees, and bundling them as needed for a given
route, then you probably don't want [Webpack](https://webpack.js.org/) to bundle
your vendor libraries while still making use of its other features and ecosystem
of plug-ins.
