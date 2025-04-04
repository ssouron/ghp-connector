/**
 * Performance Testing Utilities
 * Tools for measuring and testing formatter performance
 */

/**
 * Measure the execution time of a function
 * @param fn Function to measure
 * @param args Arguments to pass to the function
 * @returns Execution result and timing information
 */
export function measureExecutionTime<T, Args extends any[]>(
  fn: (...args: Args) => T,
  ...args: Args
): { result: T; executionTime: number } {
  const start = performance.now();
  const result = fn(...args);
  const executionTime = performance.now() - start;

  return { result, executionTime };
}

/**
 * Test memory usage of a function
 * Note: This is an approximation as JavaScript doesn't provide precise memory usage
 * For accurate measurements, use Node.js's process.memoryUsage() in a dedicated test
 * @param fn Function to test
 * @param args Arguments to pass to the function
 * @returns Memory usage information (estimated, in bytes)
 */
export function measureMemoryUsage<T, Args extends any[]>(
  fn: (...args: Args) => T,
  ...args: Args
): { result: T; memoryUsage: number } {
  // Force garbage collection if supported by Node.js with --expose-gc flag
  // This makes measurements more accurate
  if (global.gc) {
    global.gc();
  }

  // Get the baseline memory usage
  const baselineMemory = process.memoryUsage().heapUsed;

  // Execute the function
  const result = fn(...args);

  // Force garbage collection again if available
  if (global.gc) {
    global.gc();
  }

  // Get the memory usage after execution
  const afterMemory = process.memoryUsage().heapUsed;

  // Calculate the difference (this is an approximation)
  const memoryUsage = afterMemory - baselineMemory;

  return { result, memoryUsage };
}

/**
 * Run a performance test suite
 * @param testName Name of the test suite
 * @param fn Function to test
 * @param args Arguments to pass to the function
 * @param options Test options
 * @returns Performance test results
 */
export function runPerformanceTest<T, Args extends any[]>(
  testName: string,
  fn: (...args: Args) => T,
  args: Args,
  options: PerformanceTestOptions = {}
): PerformanceTestResults {
  const iterations = options.iterations || 1;
  const warmupIterations = options.warmupIterations || 0;
  const timeoutMs = options.timeoutMs || 30000;
  const logResults = options.logResults || false;

  // Ensure we don't run forever
  const startTime = Date.now();
  const testTimeout = startTime + timeoutMs;

  // Results storage
  const executionTimes: number[] = [];
  const memoryUsages: number[] = [];
  let errors = 0;
  let timeoutReached = false;

  // Perform warmup runs (not included in results)
  for (let i = 0; i < warmupIterations; i++) {
    if (Date.now() > testTimeout) {
      timeoutReached = true;
      break;
    }

    try {
      fn(...args);
    } catch (error) {
      // Ignore errors during warmup
    }
  }

  // Perform actual test iterations
  for (let i = 0; i < iterations; i++) {
    if (Date.now() > testTimeout) {
      timeoutReached = true;
      break;
    }

    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Measure execution time
      const { executionTime } = measureExecutionTime(fn, ...args);
      executionTimes.push(executionTime);

      // Measure memory usage
      const { memoryUsage } = measureMemoryUsage(fn, ...args);
      memoryUsages.push(memoryUsage);
    } catch (error) {
      errors++;
    }
  }

  // Calculate statistics
  const totalExecutions = executionTimes.length;
  const totalExecutionTime = executionTimes.reduce((sum, time) => sum + time, 0);
  const averageExecutionTime = totalExecutions > 0 ? totalExecutionTime / totalExecutions : 0;
  const minExecutionTime = Math.min(...(executionTimes.length > 0 ? executionTimes : [0]));
  const maxExecutionTime = Math.max(...(executionTimes.length > 0 ? executionTimes : [0]));

  const totalMemoryUsage = memoryUsages.reduce((sum, usage) => sum + usage, 0);
  const averageMemoryUsage = totalExecutions > 0 ? totalMemoryUsage / totalExecutions : 0;
  const peakMemoryUsage = Math.max(...(memoryUsages.length > 0 ? memoryUsages : [0]));

  // Create the results object
  const results: PerformanceTestResults = {
    testName,
    totalIterations: iterations,
    completedIterations: totalExecutions,
    timeoutReached,
    errorCount: errors,
    executionTime: {
      total: totalExecutionTime,
      average: averageExecutionTime,
      min: minExecutionTime,
      max: maxExecutionTime,
    },
    memoryUsage: {
      average: averageMemoryUsage,
      peak: peakMemoryUsage,
    },
  };

  // Log results if requested
  if (logResults) {
    console.log(`Performance Test: ${testName}`);
    console.log(
      `- Completed: ${totalExecutions}/${iterations} iterations${timeoutReached ? ' (timeout reached)' : ''}`
    );
    console.log(`- Errors: ${errors}`);
    console.log(
      `- Execution Time: avg=${averageExecutionTime.toFixed(2)}ms, min=${minExecutionTime.toFixed(2)}ms, max=${maxExecutionTime.toFixed(2)}ms`
    );
    console.log(`- Memory Usage: avg=${formatBytes(averageMemoryUsage)}, peak=${formatBytes(peakMemoryUsage)}`);
  }

  return results;
}

/**
 * Compare performance of multiple functions
 * @param testName Name of the comparison test
 * @param fns Functions to compare
 * @param args Arguments to pass to each function
 * @param options Test options
 * @returns Comparison results
 */
export function comparePerformance<T, Args extends any[]>(
  testName: string,
  fns: Array<{ name: string; fn: (...args: Args) => T }>,
  args: Args,
  options: PerformanceTestOptions = {}
): PerformanceComparisonResults {
  const results: PerformanceComparisonResults = {
    testName,
    tests: [],
  };

  // Run performance test for each function
  for (const { name, fn } of fns) {
    const testResult = runPerformanceTest(`${testName} - ${name}`, fn, args, {
      ...options,
      logResults: false, // We'll log the comparison at the end
    });

    results.tests.push({
      name,
      results: testResult,
    });
  }

  // Sort results by average execution time
  results.tests.sort((a, b) => a.results.executionTime.average - b.results.executionTime.average);

  // Calculate relative performance
  if (results.tests.length > 0) {
    const fastestTime = results.tests[0].results.executionTime.average;

    for (const test of results.tests) {
      test.relativeSpeed = fastestTime > 0 ? fastestTime / test.results.executionTime.average : 1;
    }
  }

  // Log results if requested
  if (options.logResults) {
    console.log(`Performance Comparison: ${testName}`);
    console.log('-------------------------------------------');

    for (let i = 0; i < results.tests.length; i++) {
      const test = results.tests[i];
      const relative = test.relativeSpeed !== undefined ? ` (${test.relativeSpeed.toFixed(2)}x)` : '';

      console.log(`${i + 1}. ${test.name} - ${test.results.executionTime.average.toFixed(2)}ms avg${relative}`);
      console.log(
        `   Memory: avg=${formatBytes(test.results.memoryUsage.average)}, peak=${formatBytes(test.results.memoryUsage.peak)}`
      );
    }

    console.log('-------------------------------------------');
  }

  return results;
}

/**
 * Check if a formatter has memory leaks
 * Runs the formatter multiple times on increasing data sizes and checks for abnormal memory growth
 * @param formatFn Formatter function to test
 * @param generateDataFn Function to generate test data of a specific size
 * @param options Test options
 * @returns Test results with leak detection
 */
export function checkForMemoryLeaks<T>(
  formatFn: (data: T) => string,
  generateDataFn: (size: number) => T,
  options: MemoryLeakTestOptions = {}
): MemoryLeakTestResults {
  const iterations = options.iterations || 5;
  const sizesMultiplier = options.sizesMultiplier || 2;
  const initialSize = options.initialSize || 10;
  const logResults = options.logResults || false;

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  // Initial baseline memory usage
  const baselineMemory = process.memoryUsage().heapUsed;

  // Results storage
  const sizeResults: MemorySizeResult[] = [];
  let potentialLeak = false;

  // Test with increasing data sizes
  let currentSize = initialSize;

  for (let i = 0; i < iterations; i++) {
    // Generate data of the current size
    const data = generateDataFn(currentSize);

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Record memory before test
    const beforeMemory = process.memoryUsage().heapUsed;

    // Format the data
    formatFn(data);

    // Record memory after test
    const afterMemory = process.memoryUsage().heapUsed;

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Record memory after garbage collection
    const afterGcMemory = process.memoryUsage().heapUsed;

    // Calculate usage and retained memory
    const memoryUsage = afterMemory - beforeMemory;
    const retainedMemory = afterGcMemory - beforeMemory;

    // Store results
    sizeResults.push({
      dataSize: currentSize,
      memoryUsage,
      retainedMemory,
    });

    // Increase size for next iteration
    currentSize *= sizesMultiplier;
  }

  // Analyze results for potential memory leaks
  if (sizeResults.length >= 3) {
    // Check if retained memory consistently increases
    // We expect some increase with larger data, but not proportionally more than usage
    const retainedRatios = sizeResults.map(
      (result) => result.retainedMemory / (result.memoryUsage > 0 ? result.memoryUsage : 1)
    );

    // If the ratio of retained to used memory keeps growing significantly,
    // it suggests memory isn't being properly released
    let consistentIncrease = true;
    for (let i = 2; i < retainedRatios.length; i++) {
      if (retainedRatios[i] < retainedRatios[i - 1] * 1.5) {
        consistentIncrease = false;
        break;
      }
    }

    potentialLeak = consistentIncrease;
  }

  // Create results
  const results: MemoryLeakTestResults = {
    baselineMemory,
    sizeResults,
    potentialLeak,
  };

  // Log results if requested
  if (logResults) {
    console.log('Memory Leak Test Results:');
    console.log('-------------------------------------------');
    console.log(`Baseline Memory: ${formatBytes(baselineMemory)}`);
    console.log('Size Results:');

    for (const result of sizeResults) {
      console.log(`- Size ${result.dataSize}:`);
      console.log(`  - Usage: ${formatBytes(result.memoryUsage)}`);
      console.log(`  - Retained: ${formatBytes(result.retainedMemory)}`);
    }

    console.log('-------------------------------------------');
    console.log(`Potential Memory Leak: ${potentialLeak ? 'Yes (investigate further)' : 'No'}`);
  }

  return results;
}

/**
 * Format bytes as a human-readable string
 * @param bytes Number of bytes
 * @returns Formatted string (e.g., "1.5 KB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Add TypeScript type declarations for better developer experience

export interface PerformanceTestOptions {
  iterations?: number;
  warmupIterations?: number;
  timeoutMs?: number;
  logResults?: boolean;
}

export interface PerformanceTestResults {
  testName: string;
  totalIterations: number;
  completedIterations: number;
  timeoutReached: boolean;
  errorCount: number;
  executionTime: {
    total: number;
    average: number;
    min: number;
    max: number;
  };
  memoryUsage: {
    average: number;
    peak: number;
  };
}

export interface PerformanceComparisonResults {
  testName: string;
  tests: Array<{
    name: string;
    results: PerformanceTestResults;
    relativeSpeed?: number;
  }>;
}

export interface MemoryLeakTestOptions {
  iterations?: number;
  sizesMultiplier?: number;
  initialSize?: number;
  logResults?: boolean;
}

export interface MemorySizeResult {
  dataSize: number;
  memoryUsage: number;
  retainedMemory: number;
}

export interface MemoryLeakTestResults {
  baselineMemory: number;
  sizeResults: MemorySizeResult[];
  potentialLeak: boolean;
}

// TypeScript declarations for global objects
declare global {
  namespace NodeJS {
    interface Global {
      gc?: () => void;
    }
  }
}
