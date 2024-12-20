const convertToSurrogatePair = (
  highSurrogateCodePoint: number,
  lowSurrogateCodePoint: number
): number =>
  (highSurrogateCodePoint - 0xd8_00) * 0x4_00 +
  (lowSurrogateCodePoint - 0xdc_00) +
  0x1_00_00;

export default convertToSurrogatePair;
