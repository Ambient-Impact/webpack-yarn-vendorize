#!/usr/bin/env node

import { default as vendorize } from './index.js';
import webpack from 'webpack';

// @see https://webpack.js.org/api/node

webpack(vendorize.getWebpackConfig(), function(errors, stats) {

  if (errors) {
    console.error(errors.stack || errors);
    if (errors.details) {
      console.error(errors.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

});
