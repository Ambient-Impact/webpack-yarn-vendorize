import { Config } from './config.mjs';
import { Vendorize } from './vendorize.mjs';

import { createRequire } from 'node:module';
import { cwd } from 'node:process';
// Note that at the time of writing the 'pnpapi' built-in module is CommonJS, so
// it must be import()ed and destructured like so to behave similarly to ESM
// imports.
const { default: pnp } = await import('pnpapi');

/**
 * The package.json key containing vendorize configuration.
 *
 * @type {String}
 */
const packageKey = 'vendorize';

/**
 * PnP package locator, or null if one can't be found.
 *
 * @type {PackageLocator|null}
 *
 * @see https://yarnpkg.com/advanced/pnpapi#findpackagelocator
 */
const packageLocator = pnp.findPackageLocator(cwd());

if (typeof packageLocator === 'null') {

  throw new Error(
    `Could not find the current package location to vendorize into.`
  );

}

/**
 * Yarn package information for the calling package.
 *
 * @type {PackageInformation}
 */
const packageInfo = pnp.getPackageInformation(packageLocator);

/**
 * The package.json contents, parsed into an object.
 *
 * @type {Object}
 */
const packageJson = createRequire(`${
  packageInfo.packageLocation
}`)(`${packageInfo.packageLocation}/package.json`);

if (!(packageKey in packageJson)) {
  throw new Error(`No "${packageKey}" found for this package.'`);
}

if (
  !Array.isArray(packageJson[packageKey]) &&
  !('packages' in packageJson[packageKey])
) {

  throw new Error(`'${
    packageKey
  }' must either be an array or an object containing a "packages" key.`);

}

const config = new Config(
  packageLocator.name,
  Array.isArray(packageJson[packageKey]) ?
    packageJson[packageKey] : packageJson[packageKey].packages
);

if (
  'dir' in packageJson[packageKey] &&
  typeof packageJson[packageKey].dir === 'string'
) {
  config.dirName = packageJson[packageKey].dir;
}

if (
  'clean' in packageJson[packageKey] &&
  typeof packageJson[packageKey].clean === 'boolean'
) {
  config.cleanBefore = packageJson[packageKey].clean;
}

export default new Vendorize(config);
