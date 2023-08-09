export function newUTCDatetime() {
  return new Date().toISOString().replace("Z", "");
}
