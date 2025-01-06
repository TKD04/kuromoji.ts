import isHighSurrogate from "./is-high-surrogate";
import isLowSurrogate from "./is-low-surrogate";

/**
 * Returns a boolean value representing whether the codePoint is a high or low surrogate.
 * @param codePoint A non-negative integer number representing the code point value of the UTF-16 encoded code point.
 * @returns A boolean value representing whether the codePoint is a high or low surrogate.
 */
const isSurrogatePair = (codePoint: number): boolean =>
  isHighSurrogate(codePoint) || isLowSurrogate(codePoint);

export default isSurrogatePair;
