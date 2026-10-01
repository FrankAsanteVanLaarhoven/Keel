import { markdownBlocks, markdownInlines, type MarkdownInline } from "@/lib/markdown";

function Inline({ text }: { text: string }) {
  return (
    <>
      {markdownInlines(text).map((part, index) => (
        <InlinePart key={index} part={part} />
      ))}
    </>
  );
}

function InlinePart({ part }: { part: MarkdownInline }) {
  if (part.type === "strong") return <strong>{part.text}</strong>;
  if (part.type === "em") return <em>{part.text}</em>;
  if (part.type === "del") return <del>{part.text}</del>;
  if (part.type === "code") return <code className="bg-raised px-1">{part.text}</code>;
  if (part.type === "link") {
    return (
      <a className="underline" href={part.href} rel="noreferrer" target="_blank">
        {part.text}
      </a>
    );
  }
  return <>{part.text}</>;
}

export function MarkdownView({ source }: { source: string }) {
  const blocks = markdownBlocks(source);
  if (blocks.length === 0) return <p className="text-soft"> </p>;
  return (
    <div className="space-y-4 leading-7">
      {blocks.map((block, index) => {
        if (block.type === "h" && block.level === 1) return <h2 key={index} className="text-3xl font-medium tracking-tight"><Inline text={block.text} /></h2>;
        if (block.type === "h" && block.level === 2) return <h3 key={index} className="text-2xl font-medium"><Inline text={block.text} /></h3>;
        if (block.type === "h") return <h4 key={index} className="text-xl font-medium"><Inline text={block.text} /></h4>;
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc ps-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}><Inline text={item} /></li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={index} className="list-decimal ps-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}><Inline text={item} /></li>
              ))}
            </ol>
          );
        }
        if (block.type === "task") {
          return (
            <ul key={index} className="space-y-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" disabled checked={item.checked} aria-label={item.checked ? "Checked" : "Unchecked"} />
                  <Inline text={item.text} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>{block.header.map((cell, cellIndex) => <th key={cellIndex} className="border border-line px-2 py-1 text-left font-medium"><Inline text={cell} /></th>)}</tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border border-line px-2 py-1"><Inline text={cell} /></td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "quote") return <blockquote key={index} className="border-s-2 border-copper ps-4 text-soft"><Inline text={block.text} /></blockquote>;
        if (block.type === "code") return <pre key={index} className="overflow-x-auto border border-line bg-raised p-3 font-mono text-sm"><code>{block.text}</code></pre>;
        if (block.type === "hr") return <hr key={index} className="border-line" />;
        return <p key={index}><Inline text={block.text} /></p>;
      })}
    </div>
  );
}
