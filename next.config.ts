import { existsSync } from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    BUILD_TIME: new Date().toISOString(),
    CV_AVAILABLE: String(existsSync(path.join(__dirname, 'public', 'cv.pdf'))),
  },
};

export default nextConfig;
