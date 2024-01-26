export default (char: string): boolean => {
  const utf16Code = char.charCodeAt(0);

  return utf16Code >= 0xd800 && utf16Code <= 0xdbff;
};
