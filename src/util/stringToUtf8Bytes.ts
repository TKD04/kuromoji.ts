import isLowSurrogates from "./isLowSurrogates";
import isSurrogatePair from "./isSurrogatePair";

/**
 * Convert String (UTF-16) to UTF-8 ArrayBuffer
 * @param str UTF-16 string to convert
 * @return Byte sequence encoded by UTF-8
 */
export default (str: string): Uint8Array => {
  // Max size of 1 character is 4 bytes
  const bytes = new Uint8Array(str.length * 4);
  const strLen = str.length;
  let i = 0;
  let j = 0;

  while (i < strLen) {
    const utf16Code = str.charCodeAt(i);
    let unicodeCode: number;

    i += 1;
    if (isSurrogatePair(utf16Code)) {
      const highSurrogates = utf16Code;
      const lowSurrogates = str.charCodeAt(i);

      i += 1;
      if (isLowSurrogates(lowSurrogates)) {
        unicodeCode =
          (highSurrogates - 0xd800) * (1 << 10) +
          (1 << 16) +
          (lowSurrogates - 0xdc00);
      } else {
        // malformed surrogate pair
        throw new Error(`lowSurrogates must not be malformed surrogate pair`);
      }
    } else {
      unicodeCode = utf16Code;
    }

    if (unicodeCode < 0x80) {
      // 1-byte
      bytes[j] = unicodeCode;
      j += 1;
    } else if (unicodeCode < 1 << 11) {
      // 2-byte
      bytes[j] = (unicodeCode >>> 6) | 0xc0;
      j += 1;
      bytes[j] = (unicodeCode & 0x3f) | 0x80;
      j += 1;
    } else if (unicodeCode < 1 << 16) {
      // 3-byte
      bytes[j] = (unicodeCode >>> 12) | 0xe0;
      j += 1;
      bytes[j] = ((unicodeCode >> 6) & 0x3f) | 0x80;
      j += 1;
      bytes[j] = (unicodeCode & 0x3f) | 0x80;
      j += 1;
    } else if (unicodeCode < 1 << 21) {
      // 4-byte
      bytes[j] = (unicodeCode >>> 18) | 0xf0;
      j += 1;
      bytes[j] = ((unicodeCode >> 12) & 0x3f) | 0x80;
      j += 1;
      bytes[j] = ((unicodeCode >> 6) & 0x3f) | 0x80;
      j += 1;
      bytes[j] = (unicodeCode & 0x3f) | 0x80;
      j += 1;
    } else {
      // malformed UCS4 code
      throw new Error("unicodeCode must not be malformed UCS4 code");
    }
  }

  return bytes.subarray(0, j);
};
