Copy front-end assets from [Yarn](https://yarnpkg.com/)'s virtual filesystem to
a publicly accessible vendor directory.

# Why?

If you're coming from the PHP world where [the Composer package
manager](https://getcomposer.org/) is the de facto standard in managing
dependencies, and you're working with a CMS like
[Drupal](https://www.drupal.org/) that has its own system for managing various
libraries, handling dependency trees, and bundling them as needed for a given
route, then you might not want [Webpack](https://webpack.js.org/) to bundle
your vendor libraries yet still make use of Webpack's other features and
ecosystem of plug-ins.

# What?

Let's say you have `dependency1` and `dependency2` in your `package.json`:

```json
{
  "name": "my-package",
  // ...
  "dependencies": {
    // ...
    "dependency1": "^1.0.0",
    "dependency2": "^1.0.0",
    // ...
  }
}

```

Then you do a `yarn install` and Yarn does its magic to pull in the packages.
Now they're in `.yarn/cache` but that's (hopefully) outside of your public web
root. How do you make those specific dependencies web accessible without
writing custom code or relying on some kind of bundler like Webpack?

# How?

```bash
yarn add 'webpack-yarn-vendorize@github:Ambient-Impact/webpack-yarn-vendorize' --dev
```

Next, you need to define the subset of dependencies you want vendorized by
adding a `"vendorize"` entry to your `package.json`:

```json
{
  "name": "my-package",
  // ...
  "dependencies": {
    // ...
    "dependency1": "^1.0.0",
    "dependency2": "^1.0.0",
    // ...
  },
  "vendorize": [
    "dependency1",
    "dependency2"
  ]
}
```

Note that you must explicitly declare a package as a dependency. If you don't,
Vendorize will throw an error - even if the package has been installed by Yarn
from another workspace in the same project.

Now you can run `yarn run vendorize` and once it's completed, you'll find a
`vendor` directory inside your package like so:

```
my-package
↳ vendor
  ↳ dependency1
    ↳ ...
  ↳ dependency2
    ↳ ...
```

You can also automate this so you don't need to run the command yourself by
adding it as a `postinstall` script:

```json
{
  "name": "my-package",
  // ...
  "scripts": {
    // ...
    "postinstall": "yarn run vendorize",
    // ...
  },
  // ...
}
```

Now you only need to install your package and it'll automagically run Vendorize.
