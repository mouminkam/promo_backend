import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

describe('App & Express Setup', () => {
  it('should return 404 for an unknown route', async () => {
    const res = await request(app).get('/api/v1/unknown-route-that-does-not-exist');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Route not found');
  });

  // Example of how you would test a real route
  // it('should return the categories', async () => {
  //   const res = await request(app).get('/api/v1/categories');
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.success).toBe(true);
  // });
});
