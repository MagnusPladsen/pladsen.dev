export function isCvAvailable(): boolean {
  return process.env.CV_AVAILABLE === 'true';
}
