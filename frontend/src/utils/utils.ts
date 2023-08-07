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

export function formatDate(date: Date, withTime = false) {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  if (withTime) {
    options = {
      ...options,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
  }
  return new Intl.DateTimeFormat("en-AU", options).format(new Date(date));
}
