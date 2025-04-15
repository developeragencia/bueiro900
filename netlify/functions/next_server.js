import { createRequestHandler } from '@netlify/next';

export const handler = createRequestHandler({
  compression: true,
}); 