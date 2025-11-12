/**
 * ArticleCard Component
 * 
 * A reusable, single-responsibility component for displaying article metadata.
 * Demonstrates good code craft: clear naming, small size, low coupling, high cohesion.
 * 
 * @example
 * <ArticleCard
 *   title="Test-Driven Development Improves Code Quality"
 *   authors={["Smith, J.", "Doe, A."]}
 *   publicationYear={2023}
 *   journalOrConference="ICSE"
 *   practice="TDD"
 *   claim="Improves code quality"
 *   outcome="Agree"
 * />
 */

interface ArticleCardProps {
  title: string;
  authors: string[];
  publicationYear: number;
  journalOrConference: string;
  practice?: string;
  claim?: string;
  outcome?: "Agree" | "Disagree" | "Mixed" | "Unclear";
  onClick?: () => void;
}

export default function ArticleCard({
  title,
  authors,
  publicationYear,
  journalOrConference,
  practice,
  claim,
  outcome,
  onClick
}: ArticleCardProps) {
  const outcomeColor = getOutcomeColor(outcome);
  const authorsDisplay = formatAuthors(authors);

  return (
    <article
      onClick={onClick}
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 space-y-1 text-sm text-slate-600">
        <p>
          <span className="font-medium">Authors:</span> {authorsDisplay}
        </p>
        <p>
          <span className="font-medium">Published:</span> {publicationYear} in {journalOrConference}
        </p>
        {practice && (
          <p>
            <span className="font-medium">Practice:</span> {practice}
          </p>
        )}
        {claim && (
          <p>
            <span className="font-medium">Claim:</span> {claim}
          </p>
        )}
        {outcome && (
          <p className="mt-2">
            <span
              className={`inline-block rounded px-2 py-1 text-xs font-medium ${outcomeColor}`}
            >
              {outcome}
            </span>
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Formats an array of author names into a readable string.
 * Single responsibility: string formatting logic only.
 */
function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return "Unknown";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`;
}

/**
 * Returns Tailwind CSS classes for outcome badge styling.
 * Single responsibility: mapping data to presentation.
 */
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

