import isHighSurrogate from "./is-high-surrogate";
import isLowSurrogate from "./is-low-surrogate";

/**
 * Returns a non-negative integer number representing of a surrogate pair code point value.
 * @param highSurrogateCodePoint A non-negative integer number representing of a high surrogate code point value.
 * @param lowSurrogateCodePoint A non-negative integer number representing of a low surrogate code point value.
 * @returns A non-negative integer number representing of a surrogate pair code point value.
 */
const combineToSurrogatePair = (
  highSurrogateCodePoint: number,
  lowSurrogateCodePoint: number
): number => {
  if (!isHighSurrogate(highSurrogateCodePoint)) {
    throw new RangeError(
      `highSurrogateCodePoint (0x${highSurrogateCodePoint.toString(16)}) is not a high surrogate.`
    );
  }
  if (!isLowSurrogate(lowSurrogateCodePoint)) {
    throw new RangeError(
      `lowSurrogateCodePoint (0x${lowSurrogateCodePoint.toString(16)}) is not a low surrogate.`
    );
  }
  const combinedSurrogatePair =
    (highSurrogateCodePoint - 0xd8_00) * 0x4_00 +
    (lowSurrogateCodePoint - 0xdc_00) +
    0x1_00_00;

  return combinedSurrogatePair;
};

export default combineToSurrogatePair;
