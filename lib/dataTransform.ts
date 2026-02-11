export function groupByCount(data: any[], key: string) {
  const map: Record<string, number> = {};

  data.forEach((row) => {
    const value = row[key];
    if (!value) return;
    map[value] = (map[value] || 0) + 1;
  });

  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
  }));
}
