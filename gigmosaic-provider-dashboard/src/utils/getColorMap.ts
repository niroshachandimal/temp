const COLORS = [
  "#0065F8",
  "#3498db",
  "#2ecc71",
  "#f1c40f",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#34495e",
  "#ff6b6b",
  "#00b894",
  "#6c5ce7",
  "#fd79a8",
  "#fab1a0",
  "#55efc4",
  "#ffeaa7",
  "#a29bfe",
  "#fdcb6e",
  "#00cec9",
  "#d63031",
  "#636e72",
];

export const getColorMap = <T extends string | number>(keys: T[]) => {
  const map = new Map<T, string>();
  keys.forEach((key, index) => {
    map.set(key, COLORS[index % COLORS.length]);
  });
  return map;
};
