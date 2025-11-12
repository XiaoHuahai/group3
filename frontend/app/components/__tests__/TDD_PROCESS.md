# TDD Process Documentation: getOutcomeColor

This document explains the Test-Driven Development (TDD) process for the `getOutcomeColor` function.

## TDD Process Overview

### Phase 1: Red (Write Failing Tests)

**What to do:**
1. Create the test file: `frontend/app/components/__tests__/getOutcomeColor.test.ts`
2. Write test cases BEFORE implementing the function
3. Run tests - they should FAIL (because function doesn't exist or is incomplete)

**Screenshot 1: Red Phase**
- Show the test file with all test cases
- Show test run results with failures/errors
- This demonstrates: "Tests first" approach

**To simulate Red phase for demonstration:**
```typescript
// Temporarily comment out the import to see tests fail
// import { getOutcomeColor } from '../ArticleCard';

// Or create a stub that doesn't work:
function getOutcomeColor(outcome?: string): string {
  return ''; // This will make all tests fail
}
```

---

### Phase 2: Green (Write Minimal Implementation)

**What to do:**
1. Implement the function with minimal code to make all tests pass
2. Use simple if-else statements (not optimized yet)
3. Run tests - they should all PASS

**Screenshot 2: Green Phase**
- Show the minimal implementation code
- Show test run results with all tests passing (green checkmarks)
- This demonstrates: "Make it work" approach

**Example minimal implementation:**
```typescript
export function getOutcomeColor(
  outcome?: "Agree" | "Disagree" | "Mixed" | "Unclear"
): string {
  if (outcome === "Agree") return "bg-green-100 text-green-800";
  if (outcome === "Disagree") return "bg-red-100 text-red-800";
  if (outcome === "Mixed") return "bg-yellow-100 text-yellow-800";
  if (outcome === "Unclear") return "bg-gray-100 text-gray-800";
  return "bg-slate-100 text-slate-800";
}
```

---

### Phase 3: Refactor (Improve Code, Keep Tests Green)

**What to do:**
1. Refactor the implementation (e.g., switch statement instead of if-else)
2. Run tests again - they should STILL PASS
3. Code is now cleaner and more maintainable

**Screenshot 3: Refactor Phase**
- Show the refactored code (switch statement)
- Show test run results - still all passing
- This demonstrates: "Make it right" approach

**Refactored implementation (current):**
```typescript
export function getOutcomeColor(
  outcome?: "Agree" | "Disagree" | "Mixed" | "Unclear"
): string {
  switch (outcome) {
    case "Agree":
      return "bg-green-100 text-green-800";
    case "Disagree":
      return "bg-red-100 text-red-800";
    case "Mixed":
      return "bg-yellow-100 text-yellow-800";
    case "Unclear":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}
```

---

## How to Run Tests

```powershell
# Install dependencies first (if not already installed)
cd D:\SPEED\frontend
npm install

# Run tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run specific test file
npm test getOutcomeColor
```

---

## Screenshots Checklist

For your Learning and Capability Report, capture:

- [ ] **Screenshot 1**: Test file code (all test cases)
- [ ] **Screenshot 2**: Test run results showing failures (Red phase) - if simulating
- [ ] **Screenshot 3**: Implementation code (minimal or refactored)
- [ ] **Screenshot 4**: Test run results showing all passing (Green/Refactor phase)

---

## Reflection Template

### Brief Process Description

```
TDD Process for getOutcomeColor:

1. Red Phase:
   - I wrote 6 test cases first, covering all outcome types and edge cases
   - Tests initially failed (or would fail if function didn't exist)
   - This helped clarify requirements: what inputs should produce what CSS classes

2. Green Phase:
   - I implemented minimal code using if-else statements
   - All 6 tests passed
   - Function now works correctly

3. Refactor Phase:
   - I refactored if-else to switch statement for better readability
   - Re-ran tests - all still passing
   - Code is cleaner while maintaining same functionality
```

### Reflection on Usefulness

```
Usefulness of TDD:

✅ Advantages:
- Tests serve as documentation - clear specification of expected behavior
- Caught edge cases upfront (undefined, all outcome types)
- Refactoring felt safe - tests ensured no regressions
- Forced clear interface design before coding

⚠️ Challenges:
- Initially slower - had to write tests first
- Required discipline to follow Red-Green-Refactor cycle
- For very simple functions, TDD might feel like overkill

💡 Team Impact:
- Other developers can understand function behavior by reading tests
- Future changes are safer - tests catch regressions
- Code quality improved - well-tested and documented

Overall: TDD is very useful for functions with clear inputs/outputs and multiple cases.
For this mapping function, TDD ensured I didn't miss any outcome types and made
refactoring confident. I would use TDD again for similar utility functions.
```

