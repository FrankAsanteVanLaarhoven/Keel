export function Figure({ caption, picture }: { caption: string; picture: string }) {
  return (
    <figure className="my-6">
      <pre dir="ltr" className="diagram overflow-x-auto border border-line bg-raised p-4 text-ink">
        {picture.replace(/^\n/, "").replace(/\n$/, "")}
      </pre>
      <figcaption className="mt-2 text-sm leading-6 text-soft">{caption}</figcaption>
    </figure>
  );
}
