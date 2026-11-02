import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { middleware } from './middleware';

const requestTo = (url: string) => new NextRequest(url, { headers: { host: new URL(url).host } });

describe('middleware', () => {
  it('should serve the CV on the cv subdomain', () => {
    const response = middleware(requestTo('https://cv.pladsen.dev/'));
    expect(response.headers.get('x-middleware-rewrite')).toBe('https://cv.pladsen.dev/cv.pdf');
  });

  it('should leave the main site alone', () => {
    const response = middleware(requestTo('https://pladsen.dev/'));
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });
});
