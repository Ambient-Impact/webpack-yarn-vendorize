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

  /**
   * cleanBefore setter.
   *
   * @param {Boolean} cleanBefore
   *
   * @throws Error
   *   If the parameter is not a boolean.
   */
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

  /**
   * cleanBefore getter.
   *
   * @return {Boolean}
   */
  get cleanBefore() {
    return this.#cleanBefore;
  }

  /**
   * dirName setter.
   *
   * @param {String} dirName
   *
   * @throws Error
   *   If the parameter isn't a string or if it's a zero length string.
   */
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

  /**
   * dirName getter.
   *
   * @return {String}
   */
  get dirName() {
    return this.#dirName;
  }

  /**
   * forPackage setter.
   *
   * @param {String} forPackage
   *
   * @throws Error
   *   If the parameter isn't a string or if it's a zero length string.
   */
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

  /**
   * forPackage getter.
   *
   * @return {String}
   */
  get forPackage() {
    return this.#forPackage;
  }

  /**
   * packages setter.
   *
   * @param {Array} packages
   *
   * @throws Error
   *   If the parameter isn't an array.
   */
  set packages(packages) {

    if (Array.isArray(packages) === false) {

      throw new Error(
        `The 'packages' parameter must be an array. Got '${inspect(packages)}'.`
      );

    }

    this.#packages = packages;

  }

  /**
   * packages getter.
   *
   * @return {Array}
   */
  get packages() {
    return this.#packages;
  }

}
