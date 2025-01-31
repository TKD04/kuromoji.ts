/**
 * Represents a simple counter with only one incrementing function.
 */
export default class Counter {
  /**
   * Returns the internal count.
   * @returns The internal count.
   */
  get value(): number {
    return this.#value;
  }

  /**
   * A count value.
   */
  #value = 0;

  /**
   * Adds one to the internal count.
   */
  increment(): void {
    this.#value += 1;
  }
}
