export function isCvAvailable(): boolean {
  return process.env.CV_AVAILABLE === 'true';
}

export const CV_URL = 'https://cv.pladsen.dev';
