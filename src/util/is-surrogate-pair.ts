export default (char: string | number): boolean => {
  const isString = typeof char === "string";
  const utf16Code = isString ? char.charCodeAt(0) : char;

  return utf16Code >= 0xd800 && utf16Code <= 0xdbff;
};
