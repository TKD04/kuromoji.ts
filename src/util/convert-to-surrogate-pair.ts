/**
 * Returns a non-negative integer number representing of a surrogate pair code point value.
 * @param highSurrogateCodePoint A non-negative integer number representing of a high surrogate code point value.
 * @param lowSurrogateCodePoint A non-negative integer number representing of a low surrogate code point value.
 * @returns A non-negative integer number representing of a surrogate pair code point value.
 */
const convertToSurrogatePair = (
  highSurrogateCodePoint: number,
  lowSurrogateCodePoint: number
): number =>
  (highSurrogateCodePoint - 0xd8_00) * 0x4_00 +
  (lowSurrogateCodePoint - 0xdc_00) +
  0x1_00_00;

export default convertToSurrogatePair;
