export function mapEntries<T extends Record<string, any>>(
  obj: T,
  from: any,
  to: any
) {
  return Object.entries(obj).reduce((result, [field, value]) => {
    result[field as keyof T] = value === from ? to : value;
    return result;
  }, {} as T);
}
