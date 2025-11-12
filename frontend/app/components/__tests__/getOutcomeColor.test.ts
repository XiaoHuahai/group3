/**
 * TDD Example: getOutcomeColor Function
 * 
 * This test file demonstrates Test-Driven Development (TDD) process:
 * 1. Red: Write tests first (they fail because function doesn't exist or is incomplete)
 * 2. Green: Write minimal implementation to make tests pass
 * 3. Refactor: Improve code while keeping tests green
 * 
 * For TDD demonstration, you can:
 * - Comment out the import to see tests fail (Red phase)
 * - Uncomment and implement function to see tests pass (Green phase)
 * - Refactor the implementation (Refactor phase)
 */

import { getOutcomeColor } from '../ArticleCard';

describe('getOutcomeColor', () => {
  /**
   * Test Case 1: "Agree" outcome should return green classes
   * This test defines the expected behavior for positive outcomes
   */
  it('should return green classes for "Agree"', () => {
    const result = getOutcomeColor('Agree');
    expect(result).toBe('bg-green-100 text-green-800');
  });

  /**
   * Test Case 2: "Disagree" outcome should return red classes
   * This test defines the expected behavior for negative outcomes
   */
  it('should return red classes for "Disagree"', () => {
    const result = getOutcomeColor('Disagree');
    expect(result).toBe('bg-red-100 text-red-800');
  });

  /**
   * Test Case 3: "Mixed" outcome should return yellow classes
   * This test defines the expected behavior for mixed/neutral outcomes
   */
  it('should return yellow classes for "Mixed"', () => {
    const result = getOutcomeColor('Mixed');
    expect(result).toBe('bg-yellow-100 text-yellow-800');
  });

  /**
   * Test Case 4: "Unclear" outcome should return gray classes
   * This test defines the expected behavior for unclear/unknown outcomes
   */
  it('should return gray classes for "Unclear"', () => {
    const result = getOutcomeColor('Unclear');
    expect(result).toBe('bg-gray-100 text-gray-800');
  });

  /**
   * Test Case 5: undefined should return default slate classes
   * This test ensures the function handles edge cases gracefully
   */
  it('should return default slate classes for undefined', () => {
    const result = getOutcomeColor(undefined);
    expect(result).toBe('bg-slate-100 text-slate-800');
  });

  /**
   * Test Case 6: No argument should return default classes
   * This test ensures the function works when called without arguments
   */
  it('should return default classes when called with no argument', () => {
    const result = getOutcomeColor();
    expect(result).toBe('bg-slate-100 text-slate-800');
  });
});

