/**
 * YearRangeInput Component
 * 
 * A small, focused component for selecting a year range (from-to).
 * Demonstrates good code craft: single responsibility, clear interface, validation.
 * 
 * @example
 * <YearRangeInput
 *   fromYear={2020}
 *   toYear={2024}
 *   onFromChange={(year) => setFromYear(year)}
 *   onToChange={(year) => setToYear(year)}
 * />
 */

interface YearRangeInputProps {
  fromYear?: number;
  toYear?: number;
  onFromChange: (year: number | undefined) => void;
  onToChange: (year: number | undefined) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export default function YearRangeInput({
  fromYear,
  toYear,
  onFromChange,
  onToChange,
  minYear = 1900,
  maxYear = new Date().getFullYear() + 1,
  className = ""
}: YearRangeInputProps) {
  const handleFromChange = (value: string) => {
    const year = parseYear(value, minYear, maxYear);
    onFromChange(year);
  };

  const handleToChange = (value: string) => {
    const year = parseYear(value, minYear, maxYear);
    onToChange(year);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="number"
        value={fromYear ?? ""}
        onChange={(e) => handleFromChange(e.target.value)}
        placeholder={minYear.toString()}
        min={minYear}
        max={maxYear}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Year from"
      />
      <span className="text-slate-500" aria-hidden="true">
        —
      </span>
      <input
        type="number"
        value={toYear ?? ""}
        onChange={(e) => handleToChange(e.target.value)}
        placeholder={maxYear.toString()}
        min={minYear}
        max={maxYear}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Year to"
      />
    </div>
  );
}

/**
 * Parses and validates a year string.
 * Single responsibility: input validation and type conversion.
 * 
 * @returns Valid year number, or undefined if invalid/empty
 */
function parseYear(value: string, min: number, max: number): number | undefined {
  if (!value.trim()) return undefined;
  const year = parseInt(value, 10);
  if (isNaN(year)) return undefined;
  if (year < min || year > max) return undefined;
  return year;
}

