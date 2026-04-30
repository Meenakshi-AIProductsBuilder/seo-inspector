import { SeoAnalysisResultRawTags } from "@workspace/api-client-react";

interface Props {
  tags: SeoAnalysisResultRawTags;
}

export function RawTagsTable({ tags }: Props) {
  const entries = Object.entries(tags || {});

  if (entries.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">No meta tags found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/50 text-muted-foreground font-mono text-xs">
            <th className="py-3 px-4 font-normal w-1/3">Name / Property</th>
            <th className="py-3 px-4 font-normal">Content</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs">
          {entries.map(([key, value], i) => (
            <tr key={i} className="border-b border-border/30 hover:bg-card/50 transition-colors">
              <td className="py-3 px-4 text-primary align-top font-bold break-all">{key}</td>
              <td className="py-3 px-4 text-muted-foreground break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
