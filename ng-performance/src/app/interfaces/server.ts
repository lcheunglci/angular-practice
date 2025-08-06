
export interface Server {
  status: '?' | 'ERROR' | 'OK';
  closest: '?' | 'ERROR' | 'US1' | 'US2' | 'EU1' | 'EU2';
  latency: '?' | 'ERROR' | `${number}ms`;
}
