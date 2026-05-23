export const constants = {
  Z_BEST_COMPRESSION: 9,
  Z_BEST_SPEED: 1,
  Z_DEFAULT_COMPRESSION: -1,
};

export function gunzipSync(): never {
  throw new Error('gzip commands are not available in this browser resume');
}

export function gzipSync(): never {
  throw new Error('gzip commands are not available in this browser resume');
}
