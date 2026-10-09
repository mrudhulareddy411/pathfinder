import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%
    http_req_duration: ['p(95)<1500'], // 95% of requests should be below 1500ms
  },
};

export default function () {
  // Use the BACKEND_URL from environment or fallback to localhost
  const url = __ENV.BACKEND_URL || 'http://127.0.0.1:5000/api/health';
  
  const res = http.get(url);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  
  // Optional: add a small sleep to simulate real user think time
  sleep(1);
}
