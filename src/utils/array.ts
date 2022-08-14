export function getUniquePropertyValues<T>(
  arObjects: T[],
  attrName: keyof T,
): any[] {
  return [
    ...new Set(arObjects.map((o) => o[attrName]).filter((o) => Boolean(o))),
  ];
}
