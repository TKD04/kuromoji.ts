/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import stringToUtf8Bytes from "./stringToUtf8Bytes";
import utf8BytesToString from "./utf8BytesToString";

/**
 * Utilities to manipulate byte sequence
 */
export default class ByteBuffer {
  buffer: Uint8Array;

  position: number;

  /**
   * @param arg Initial size of this buffer (number), or buffer to set (Uint8Array)
   */
  constructor(arg: null | number | Uint8Array) {
    let initialSize;

    if (arg === null) {
      initialSize = 1024 * 1024;
    } else if (typeof arg === "number") {
      initialSize = arg;
    } else if (arg instanceof Uint8Array) {
      this.buffer = arg;
      this.position = 0; // Overwrite
      return;
    } else {
      // typeof arg -> String
      throw new Error(
        `${typeof arg} is invalid parameter type for ByteBuffer constructor`
      );
    }
    // arg is null or number
    this.buffer = new Uint8Array(initialSize);
    this.position = 0;
  }

  size(): number {
    return this.buffer.length;
  }

  reallocate(): void {
    const newArray = new Uint8Array(this.buffer.length * 2);

    newArray.set(this.buffer);
    this.buffer = newArray;
  }

  shrink(): Uint8Array {
    this.buffer = this.buffer.subarray(0, this.position);

    return this.buffer;
  }

  put(b: number): void {
    if (this.buffer.length < this.position + 1) {
      this.reallocate();
    }
    this.buffer[this.position] = b;
    this.position += 1;
  }

  get(index: number) {
    let idx = this.position;
    if (index !== null) {
      idx = index;
    } else {
      this.position += 1;
    }
    if (this.buffer.length < idx + 1) {
      return 0;
    }
    return this.buffer[idx];
  }

  // Write short to buffer by little endian
  putShort(num: number): void {
    if (num > 0xffff) {
      throw new Error(`${num} is over short value`);
    }
    const lower = 0x00ff & num;
    const upper = (0xff00 & num) >> 8;

    this.put(lower);
    this.put(upper);
  }

  // Read short from buffer by little endian
  getShort(index: number | null): number {
    let idx = this.position;

    if (index !== null) {
      idx = index;
    } else {
      this.position += 2;
    }
    if (this.buffer.length < idx + 2) {
      return 0;
    }
    const lower = this.buffer[idx];
    const upper = this.buffer[idx + 1];
    if (typeof lower === "undefined") {
      throw new Error("lower must not be undefined");
    }
    if (typeof upper === "undefined") {
      throw new Error("upper must not be undefined");
    }
    let value = (upper << 8) + lower;
    if (value & 0x8000) {
      value = -((value - 1) ^ 0xffff);
    }

    return value;
  }

  // Write integer to buffer by little endian
  putInt(num: number): void {
    if (num > 0xffffffff) {
      throw new Error(`${num} is over integer value`);
    }
    const b0 = 0x000000ff & num;
    const b1 = (0x0000ff00 & num) >> 8;
    const b2 = (0x00ff0000 & num) >> 16;
    const b3 = (0xff000000 & num) >> 24;
    this.put(b0);
    this.put(b1);
    this.put(b2);
    this.put(b3);
  }

  // Read integer from buffer by little endian
  getInt(index: number): number {
    let idx = this.position;

    if (index !== null) {
      idx = index;
    } else {
      this.position += 4;
    }
    if (this.buffer.length < idx + 4) {
      return 0;
    }
    const b0 = this.buffer[idx];
    const b1 = this.buffer[idx + 1];
    const b2 = this.buffer[idx + 2];
    const b3 = this.buffer[idx + 3];
    if (typeof b0 === "undefined") {
      throw new Error("b0 must not be undefined");
    }
    if (typeof b1 === "undefined") {
      throw new Error("b1 must not be undefined");
    }
    if (typeof b2 === "undefined") {
      throw new Error("b2 must not be undefined");
    }
    if (typeof b3 === "undefined") {
      throw new Error("b3 must not be undefined");
    }

    return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0;
  }

  readInt(): number {
    const pos = this.position;

    this.position += 4;

    return this.getInt(pos);
  }

  putString(str: string): void {
    const bytes = stringToUtf8Bytes(str);

    bytes.forEach((byte) => {
      this.put(byte);
    });
    // put null character as terminal character
    this.put(0);
  }

  getString(index: number): string {
    const buffer: number[] = [];
    let char: number;
    let idx = this.position;

    if (index !== null) {
      idx = index;
    }
    while (true) {
      if (this.buffer.length < index + 1) {
        break;
      }
      const tempChar = this.get(idx);
      if (typeof tempChar === "undefined") {
        throw new Error("tempChar must not be undefined");
      }
      char = tempChar;
      idx += 1;
      if (char === 0) {
        break;
      } else {
        buffer.push(char);
      }
    }
    this.position = idx;

    return utf8BytesToString(new Uint8Array(buffer));
  }
}
