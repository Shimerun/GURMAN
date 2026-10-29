const MOCK_LATENCY_MS = 500;
const MOCK_FAILURE_RATE = Number(import.meta.env.VITE_MOCK_FAILURE_RATE ?? 0);

export class ServiceError extends Error {
  /**
   * @param {string} message
   * @param {{ service: string, operation: string, cause?: unknown }} context
   */
  constructor(message, { service, operation, cause }) {
    super(message, { cause });
    this.name = 'ServiceError';
    this.service = service;
    this.operation = operation;
  }
}

/**
 * Mimics a network round-trip. Set VITE_MOCK_FAILURE_RATE (0..1) to exercise error/retry UI.
 * @param {{ service: string, operation: string }} context
 */
export async function simulateNetworkLatency(context) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  if (Math.random() < MOCK_FAILURE_RATE) {
    throw new ServiceError(`${context.service}.${context.operation}: simulated network failure`, context);
  }
}
