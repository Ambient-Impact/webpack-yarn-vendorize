/**
 * Vendorize configuration object.
 *
 * @todo Add parameter validation to setters to throw errors if values aren't
 *   in the expected formats or contain valid values.
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
    this.#cleanBefore = cleanBefore;
  }

  get cleanBefore() {
    return this.#cleanBefore;
  }

  set dirName(dirName) {
    this.#dirName = dirName;
  }

  get dirName() {
    return this.#dirName;
  }

  set forPackage(forPackage) {
    this.#forPackage = forPackage;
  }

  get forPackage() {
    return this.#forPackage;
  }

  set packages(packages) {
    this.#packages = packages;
  }

  get packages() {
    return this.#packages;
  }

}
