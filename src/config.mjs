import { inspect } from 'node:util';

/**
 * Vendorize configuration object.
 */
export class Config {

  /**
   * One or more package names to vendorize.
   *
   * @type {String[]}
   */
  #packages;

  /**
   * The package name to vendorize for/into.
   *
   * @type {String}
   */
  #forPackage;

  /**
   * The directory name to vendorize packages to.
   *
   * This is relative to the package that we're vendorizing for/into.
   *
   * @type {String}
   */
  #dirName = 'vendor';

  /**
   * Whether to clean out the vendor directory before vendorizing.
   *
   * @type {Boolean}
   */
  #cleanBefore = true;

  constructor(forPackage, packages) {

    this.forPackage = forPackage;
    this.packages   = packages;

  }

  set cleanBefore(cleanBefore) {

    if (typeof cleanBefore !== 'boolean') {

      throw new Error(
        `The 'cleanBefore' parameter must be a boolean. Got '${
          typeof cleanBefore
        }'.`
      );

    }

    this.#cleanBefore = cleanBefore;

  }

  get cleanBefore() {
    return this.#cleanBefore;
  }

  set dirName(dirName) {

    if (typeof dirName !== 'string') {

      throw new Error(
        `The 'dirName' parameter must be a string. Got '${inspect(dirName)}'.`
      );

    }

    if (dirName.length === 0) {

      throw new Error(`The 'dirName' parameter cannot be an empty string.`);

    }

    this.#dirName = dirName;

  }

  get dirName() {
    return this.#dirName;
  }

  set forPackage(forPackage) {

    if (typeof forPackage !== 'string') {

      throw new Error(
        `The 'forPackage' parameter must be a string. Got '${
          inspect(forPackage)
        }'.`
      );

    }

    if (forPackage.length === 0) {

      throw new Error(`The 'forPackage' parameter cannot be an empty string.`);

    }

    this.#forPackage = forPackage;

  }

  get forPackage() {
    return this.#forPackage;
  }

  set packages(packages) {

    if (Array.isArray(packages) === false) {

      throw new Error(
        `The 'packages' parameter must be an array. Got '${inspect(packages)}'.`
      );

    }

    this.#packages = packages;

  }

  get packages() {
    return this.#packages;
  }

}
