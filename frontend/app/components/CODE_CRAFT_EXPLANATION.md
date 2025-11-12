# Code Craft Examples: ArticleCard & YearRangeInput

This document explains why `ArticleCard.tsx` and `YearRangeInput.tsx` demonstrate good code craft according to Assignment 1B evaluation criteria.

## Component 1: ArticleCard

**File:** `frontend/app/components/ArticleCard.tsx`

### Why This is Good Code Craft

1. **Clear Naming Conventions**
   - Component name `ArticleCard` clearly indicates its purpose
   - Props interface `ArticleCardProps` follows TypeScript naming conventions
   - Helper functions `formatAuthors()` and `getOutcomeColor()` have descriptive, verb-based names
   - Variables like `authorsDisplay` and `outcomeColor` clearly express their purpose

2. **Single Responsibility Principle**
   - The component has ONE job: display article metadata in a card format
   - Helper functions each do ONE thing:
     - `formatAuthors()`: formats author array to string
     - `getOutcomeColor()`: maps outcome enum to CSS classes
   - No business logic, API calls, or state management mixed in

3. **Small, Focused Components**
   - Main component: ~50 lines
   - Helper functions: ~5-10 lines each
   - Easy to read, test, and maintain

4. **Low Coupling, High Cohesion**
   - **Low Coupling**: Component doesn't depend on specific parent components or global state
   - **High Cohesion**: All code in the file relates to displaying article cards
   - Props interface defines clear contract with parent components

5. **Type Safety**
   - Full TypeScript typing with `ArticleCardProps` interface
   - Union types for `outcome` ensure only valid values
   - Optional props (`?`) clearly marked

6. **Reusability**
   - Can be used anywhere articles need to be displayed
   - No hardcoded dependencies
   - Configurable via props

7. **Separation of Concerns**
   - Presentation logic (JSX) separated from formatting logic (helper functions)
   - No business rules mixed with UI rendering

---

## Component 2: YearRangeInput

**File:** `frontend/app/components/YearRangeInput.tsx`

### Why This is Good Code Craft

1. **Clear Naming Conventions**
   - Component name `YearRangeInput` is self-documenting
   - Props like `onFromChange` and `onToChange` clearly indicate callbacks
   - Function `parseYear()` clearly describes its purpose

2. **Single Responsibility Principle**
   - ONE job: provide a year range input (from-to)
   - Validation logic isolated in `parseYear()` helper
   - No side effects, no API calls, no complex state

3. **Small, Focused Components**
   - Main component: ~40 lines
   - Helper function: ~10 lines
   - Easy to understand at a glance

4. **Low Coupling, High Cohesion**
   - **Low Coupling**: Uses callback props instead of direct state access
   - **High Cohesion**: All code relates to year range input functionality
   - No dependencies on external services or global state

5. **Intentional Code Design**
   - Props interface clearly defines what the component needs
   - Default values (`minYear`, `maxYear`) provide sensible defaults
   - Validation happens in a dedicated function, not inline

6. **Reusability**
   - Can be dropped into any form that needs year range selection
   - Configurable min/max years
   - Callback pattern allows parent to control state

7. **Separation of Concerns**
   - UI rendering (JSX) separated from validation logic (`parseYear`)
   - No business rules in the component
   - Parent component controls the actual state

---

## How to Use These Components

### ArticleCard Example

```tsx
import ArticleCard from '@/app/components/ArticleCard';

<ArticleCard
  title="Test-Driven Development Improves Code Quality"
  authors={["Smith, J.", "Doe, A."]}
  publicationYear={2023}
  journalOrConference="ICSE"
  practice="TDD"
  claim="Improves code quality"
  outcome="Agree"
  onClick={() => router.push(`/articles/${articleId}`)}
/>
```

### YearRangeInput Example

```tsx
import YearRangeInput from '@/app/components/YearRangeInput';
import { useState } from 'react';

const [fromYear, setFromYear] = useState<number | undefined>(2020);
const [toYear, setToYear] = useState<number | undefined>(2024);

<YearRangeInput
  fromYear={fromYear}
  toYear={toYear}
  onFromChange={setFromYear}
  onToChange={setToYear}
  minYear={2000}
  maxYear={2025}
/>
```

---

## Screenshot Instructions

1. **Take a screenshot of the component code** in your IDE showing:
   - The component definition
   - The TypeScript interface
   - Helper functions
   - Clear structure and formatting

2. **Take a screenshot of the component in use** (if you add it to a page):
   - Show the rendered UI
   - Demonstrate it working

3. **In your Learning and Capability Report**, include:
   - Screenshots of both components
   - Explanation referencing the criteria above
   - How these components demonstrate the code craft principles

---

## Alignment with Assignment Criteria

These components directly address:

- ✅ **Naming conventions are consistent and good practice**
- ✅ **The intentionality of the code is clear from naming**
- ✅ **Code components are cohesive and have low coupling**
- ✅ **Code components have a single responsibility**
- ✅ **Code components and their unit tests are small, generally**
- ✅ **The user interface views are separated from business rules**

