/**
 * Test utilities to help catch errors early and provide better debugging info
 */

export function assertNoError<T>(result: [T, Error | null], context: string): T {
  const [value, error] = result;
  if (error) {
    throw new Error(`${context}: Unexpected error - ${error.message}`);
  }
  return value;
}

export function measureTime<T>(fn: () => T, description: string): T {
  const start = Date.now();
  try {
    const result = fn();
    const duration = Date.now() - start;
    console.log(`${description}: ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`${description}: Failed after ${duration}ms with error:`, error);
    throw error;
  }
}

export async function measureTimeAsync<T>(fn: () => Promise<T>, description: string): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    console.log(`${description}: ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`${description}: Failed after ${duration}ms with error:`, error);
    throw error;
  }
}

export function withTimeout<T>(fn: () => T, timeoutMs: number, description: string): T {
  const start = Date.now();
  const result = fn();
  const duration = Date.now() - start;

  if (duration > timeoutMs) {
    throw new Error(
      `${description}: Operation took ${duration}ms, which exceeds timeout of ${timeoutMs}ms`
    );
  }

  return result;
}
