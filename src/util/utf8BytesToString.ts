/**
 * Convert UTF-8 ArrayBuffer to String (UTF-16)
 * @param bytes UTF-8 byte sequence to convert
 * @return String encoded by UTF-16
 */
export default (bytes: Uint8Array): string => {
  let str = "";
  let code;
  let b1;
  let b2;
  let b3;
  let b4;
  let upper;
  let lower;
  let i = 0;

  while (i < bytes.length) {
    b1 = bytes[i];
    if (typeof b1 === "undefined") {
      throw new Error("b1 must not be undefined");
    }
    i += 1;

    if (b1 < 0x80) {
      // 1 byte
      code = b1;
    } else if (b1 >> 5 === 0x06) {
      // 2 bytes
      b2 = bytes[i];
      if (typeof b2 === "undefined") {
        throw new Error("b2 must not be undefined");
      }
      i += 1;
      code = ((b1 & 0x1f) << 6) | (b2 & 0x3f);
    } else if (b1 >> 4 === 0x0e) {
      // 3 bytes
      b2 = bytes[i];
      if (typeof b2 === "undefined") {
        throw new Error("b2 must not be undefined");
      }
      i += 1;
      b3 = bytes[i];
      if (typeof b3 === "undefined") {
        throw new Error("b3 must not be undefined");
      }
      i += 1;
      code = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
    } else {
      // 4 bytes
      b2 = bytes[i];
      if (typeof b2 === "undefined") {
        throw new Error("b2 must not be undefined");
      }
      i += 1;
      b3 = bytes[i];
      if (typeof b3 === "undefined") {
        throw new Error("b3 must not be undefined");
      }
      i += 1;
      b4 = bytes[i];
      if (typeof b4 === "undefined") {
        throw new Error("b4 must not be undefined");
      }
      i += 1;
      code =
        ((b1 & 0x07) << 18) |
        ((b2 & 0x3f) << 12) |
        ((b3 & 0x3f) << 6) |
        (b4 & 0x3f);
    }

    if (code < 0x10000) {
      str += String.fromCharCode(code);
    } else {
      // surrogate pair
      code -= 0x10000;
      upper = 0xd800 | (code >> 10);
      lower = 0xdc00 | (code & 0x3ff);
      str += String.fromCharCode(upper, lower);
    }
  }

  return str;
};
