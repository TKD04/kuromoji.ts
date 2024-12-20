/**
 * Returns a boolean value representing whether the codePoint is a low surrogate.
 * @param codePoint A non-negative integer number representing the code point value of the UTF-16 encoded code point.
 * @returns A boolean value representing whether the codePoint is a low surrogate.
 */
const isLowSurrogate = (codePoint: number): boolean =>
  codePoint >= 0xdc_00 && codePoint <= 0xdf_ff;

export default isLowSurrogate;
