import Encore from '@symfony/webpack-encore';
import { createRequire } from 'node:module';
import * as path from 'node:path';

// Note that at the time of writing the 'pnpapi' built-in module is CommonJS, so
// it must be import()ed and destructured like so to behave similarly to ESM
// imports.
const { default: pnp } = await import('pnpapi');

/**
 * Our PnP API issuer; i.e. the name of our package.
 *
 * @type {String}
 *
 * @see https://nodejs.org/api/esm.html#importmetaurl
 *
 * @see https://yarnpkg.com/advanced/pnpapi#findpackagelocator
 *
 * @see https://yarnpkg.com/advanced/pnpapi#resolvetounqualified
 */
const pnpIssuer = pnp.findPackageLocator(new URL(
  import.meta.url
).pathname).name;

/**
 * The Vendorize class; builds and runs vendorize tasks.
 */
export class Vendorize {

  /**
   * The configuration object.
   *
   * @type {Config}
   */
  #config;

  constructor(config) {
    this.#config = config;
  }

  /**
   * Get the absolute path to the package we're vendorizing to.
   *
   * @return {String}
   */
  #getForPackagePath() {

    return pnp.resolveToUnqualified(
      this.#config.forPackage, pnpIssuer
    );

  }

  /**
   * Get the configured vendor directory name.
   *
   * @return {String}
   */
  getVendorDirName() {
    return this.#config.dirName;
  }

  /**
   * Get the full absolute path to the configured vendor directory.
   *
   * @return {String}
   */
  getVendorPath() {
    return path.resolve(this.#getForPackagePath(), this.getVendorDirName());
  }

  /**
   * Get a package's version from Yarn if possible.
   *
   * @param {PackageLocator} packageLocator
   *   The Yarn package locator for the package.
   *
   * @return {String|null}
   *   The package version or null if it couldn't be found.
   *
   * @see https://github.com/yarnpkg/berry/blob/d181aa62bec96ff5d7c4b60ce1a54e6f89d935f0/packages/plugin-essentials/sources/commands/info.ts#L308
   *   At the time of writing, Yarn 3 doesn't seem to expose an easy way to get
   *   just the semver without the 'npm:' (or other registry?) prefix. This is
   *   what the 'yarn info' command does.
   *
   * @see https://yarnpkg.com/advanced/rulebook#packages-should-only-ever-require-what-they-formally-list-in-their-dependencies
   *
   * @see https://nodejs.org/api/module.html#modulecreaterequirefilename
   *   We use this to require the package.json of the package as itself, which
   *   avoids Yarn throwing an error if the package is not directly required by
   *   the current one.
   *
   * @see https://www.npmjs.com/package/semver#coercion
   *   Alternatively, we could use the semver package to coerce the version
   *   string returned by Yarn instead of loading the package.json.
   */
  #getPackageVersion(packageLocator) {

    /**
     * Yarn package information for the given package.
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

    if (!('version' in packageJson)) {
      return null;
    }

    return packageJson.version;

  }

  /**
   * Get the configuration array to pass to Encore.copyFiles().
   *
   * @return {Object[]}
   *   Array of objects with 'from' and 'to' keys defining the Yarn virtual
   *   filesystem paths and their corresponding output paths under the vendor
   *   directory to be copied to.
   *
   * @see https://github.com/symfony/webpack-encore/blob/main/index.js
   *   Documents the API.
   */
  #getCopyConfig() {

    /**
     * Configuration array for Encore.copyFiles().
     *
     * @type {Object[]}
     */
    let copyConfig = [];

    /**
     * Package names to vendorize.
     *
     * @type {String[]}
     */
    const packageNames = this.#config.packages;

    for (let i = 0; i < packageNames.length; i++) {

      // The resolved virtual filesystem path to the root directory of this
      // package.
      const packagePath = pnp.resolveToUnqualified(
        packageNames[i], pnpIssuer
      );

      copyConfig.push({
        from: packagePath,
        to:   `${packageNames[i]}/[path][name].[ext]`
      });

    }

    return copyConfig;

  }

  /**
   * Build, configure, and get the Webpack Encore object to perform the copy.
   *
   * @return {Encore}
   */
  getWebpackEncore() {

    // @see https://symfony.com/doc/current/frontend/encore/installation.html#creating-the-webpack-config-js-file
    if (!Encore.isRuntimeEnvironmentConfigured()) {
      Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
    }

    Encore
    .setOutputPath(this.getVendorPath())

    // Encore will complain if the public path doesn't start with a slash.
    .setPublicPath('/')
    .setManifestKeyPrefix('')

    // We need to set either this or Encore.enableSingleRuntimeChunk() otherwise
    // Encore will refuse to run.
    .disableSingleRuntimeChunk()

    .copyFiles(this.#getCopyConfig());

    // Delete any previous vendor directory contents.
    if (this.#config.cleanBefore === true) {
      Encore.cleanupOutputBeforeBuild([`${this.getVendorPath()}/**`]);
    }

    return Encore;

  }

  /**
   * Get the Webpack configuration object to copy files.
   *
   * @return {Object}
   */
  getWebpackConfig() {

    return this.getWebpackEncore().getWebpackConfig();

  }

  /**
   * Webpack filename callback to update asset paths to vendor directory.
   *
   * This is used to inform the Sass loader where the fonts are, for example.
   *
   * @param {Object} pathData
   *
   * @return {String}
   */
  assetFileName(pathData) {

    /**
     * PnP package locator, or null if one can't be found.
     *
     * @type {PackageLocator|null}
     *
     * @see https://yarnpkg.com/advanced/pnpapi#findpackagelocator
     */
    const packageLocator = pnp.findPackageLocator(pathData.module.request);

    // If no package locator can be found, or the package locator is for a
    // package that we're not told to vendorize, just return the unmodified file
    // name.
    if (
      typeof packageLocator === 'null' ||
      this.#config.packages.indexOf(packageLocator.name) === -1
    ) {
      return pathData.module.rawRequest;
    }

    /**
     * The package version.
     *
     * @type {String|null}
     */
    let packageVersion = this.#getPackageVersion(packageLocator);

    // If the package version couldn't be found, fall back to using the hash.
    //
    // Note that pathData.contentHash doesn't always seem to contain a valid hash,
    // but the longer pathData.module.buildInfo.hash always seems to.
    if (typeof packageVersion === 'null') {
      packageVersion = pathData.module.buildInfo.hash;
    }

    /**
     * Path parts as parsed by path.parse().
     *
     * @type {Object}
     */
    const pathParts = path.parse(pathData.module.rawRequest);

    return `${this.getVendorDirName()}/${pathParts.dir}/${pathParts.name}${
      pathParts.ext
    }?v=${packageVersion}`;
  }

}
