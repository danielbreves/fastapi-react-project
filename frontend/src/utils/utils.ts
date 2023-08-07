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

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(date));
}