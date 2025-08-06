const cache = new WeakMap();

export const calculateAverage = (input: number[]): number => {
  if (cache.has(input)) return cache.get(input);

  const total = input.reduce((acc, next) => acc + next, 0);
  const average = total / input.length;

  cache.set(input, average);

  return average;
};
