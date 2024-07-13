export function hexToRGBA(hex: string, opacity: number) {
  // # 문자를 제거
  const sanitizedHex = hex.replace('#', '');

  // 3자리 또는 6자리의 각 색상 부분을 추출
  const hexParts = sanitizedHex.match(
    new RegExp(`.{1,${sanitizedHex.length / 3}}`, 'g')
  );

  // 각 색상 부분을 10진수로 변환
  if (hexParts && hexParts.length === 3) {
    const rgb = hexParts.map((part) =>
      parseInt(part.length === 1 ? part + part : part, 16)
    );
    return `rgba(${rgb.join(',')},${isFinite(opacity) ? opacity : 1})`;
  }

  // 잘못된 hex 값인 경우 기본적으로 검은색 반환
  return `rgba(0,0,0,${isFinite(opacity) ? opacity : 1})`;
}
