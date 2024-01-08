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

export const stringifyDate = (date: unknown): string | undefined => {
  if (!date) {
    return undefined;
  }
  if (typeof date == 'string') {
    return date;
  }
  if (date instanceof Date) {
    return date.toISOString();
  } else {
    return date.toString();
  }
};
