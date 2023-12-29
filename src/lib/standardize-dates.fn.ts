export const standardizeCreateAndUpdate = <T extends { created: unknown; updated: unknown }>(
  item: T
): T => {
  let { created, updated } = item;
  created = standardizeDate(created);
  updated = standardizeDate(updated);

  return { ...item, created, updated };
};

export const standardizeDate = (str: unknown): Date | undefined => {
  if (typeof str == 'string' && str.length >= 10) {
    return new Date(str);
  }
  if (str instanceof Date) {
    return str;
  } else return undefined;
};
