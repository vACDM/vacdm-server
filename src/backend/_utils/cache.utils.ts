export class Cache<T extends (...args: unknown[]) => unknown> {
  private map = new Map<string, ReturnType<T>>();

  constructor(
    private func: T,
    private timeout = 100,
  ) {}

  get(...params: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(params);

    const cached = this.map.get(key);

    if (cached) {
      return cached;
    }

    const result = this.func(...params) as ReturnType<T>;

    this.map.set(key, result);

    setTimeout(() => {
      this.map.delete(key);
    }, this.timeout);

    return result;
  }
}
