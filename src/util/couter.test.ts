import { describe, expect, it } from "@jest/globals";

import Counter from "./counter";

describe("class Counter", () => {
  describe("get value()", () => {
    it("returns zero after the counter object has been created", () => {
      expect.assertions(1);

      const counter = new Counter();

      const actual = counter.value;

      expect(actual).toBe(0);
    });
  });

  describe("increment()", () => {
    it("returns 1 after calling increment() once", () => {
      expect.assertions(1);

      const counter = new Counter();

      counter.increment();
      const actual = counter.value;

      expect(actual).toBe(1);
    });

    it("returns 2 after calling increment() twice", () => {
      expect.assertions(1);

      const counter = new Counter();

      counter.increment();
      counter.increment();
      const actual = counter.value;

      expect(actual).toBe(2);
    });
  });
});
