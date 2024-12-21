/**
 * Returns a boolean value representing whether the codePoint is a high or low surrogate.
 * @param codePoint A non-negative integer number representing the code point value of the UTF-16 encoded code point.
 * @returns A boolean value representing whether the codePoint is a high or low surrogate.
 */
const isSurrogatePair = (codePoint: number): boolean =>
  codePoint >= 0xd8_00 && codePoint <= 0xdb_ff;

export default isSurrogatePair;
