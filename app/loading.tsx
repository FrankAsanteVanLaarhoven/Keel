export default function Loading() {
  return (
    <div
      className="mx-auto max-w-4xl px-5 py-20"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-24 bg-line" />
        <div className="h-10 w-3/4 max-w-md bg-line" />
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full bg-line/60" />
          <div className="h-4 w-5/6 bg-line/60" />
          <div className="h-4 w-2/3 bg-line/60" />
        </div>
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
