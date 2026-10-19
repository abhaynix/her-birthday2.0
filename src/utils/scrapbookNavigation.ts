export const moveSpread = (current: number, direction: -1 | 1, total: number) =>
  Math.max(0, Math.min(total - 1, current + direction));
