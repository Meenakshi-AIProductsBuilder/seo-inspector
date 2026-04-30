import { SeoTagCheck } from "@workspace/api-client-react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  checks: SeoTagCheck[];
}

export function TagChecksList({ checks }: Props) {
  if (!checks?.length) {
    return <div className="text-muted-foreground p-4 text-sm font-mono border border-dashed rounded-lg">No checks available in this category.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {checks.map((check, index) => {
        const isPass = check.status === "pass";
        const isWarn = check.status === "warn";
        const isFail = check.status === "fail";

        const Icon = isPass ? CheckCircle2 : isFail ? XCircle : AlertTriangle;
        
        let statusColor = "text-green-500";
        let bgColor = "bg-green-500/10 border-green-500/20";
        if (isFail) {
          statusColor = "text-destructive";
          bgColor = "bg-destructive/10 border-destructive/20";
        } else if (isWarn) {
          statusColor = "text-yellow-500";
          bgColor = "bg-yellow-500/10 border-yellow-500/20";
        }

        return (
          <div 
            key={`${check.tag}-${index}`}
            className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-card transition-colors"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3 md:w-1/3 shrink-0">
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${statusColor}`} />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-mono text-sm font-bold text-foreground truncate" title={check.tag}>{check.tag}</span>
                <Badge variant="outline" className={`w-fit uppercase text-[10px] tracking-wider font-mono ${bgColor} ${statusColor}`}>
                  {check.status}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-0 md:w-2/3">
              {check.value ? (
                <div className="font-mono text-xs text-muted-foreground bg-black/20 p-2 rounded break-all border border-border/30">
                  {check.value.length > 200 ? check.value.substring(0, 200) + '...' : check.value}
                </div>
              ) : (
                <div className="font-mono text-xs text-muted-foreground/50 italic p-2 rounded border border-dashed border-border/30 w-fit">
                  &lt;empty&gt;
                </div>
              )}
              <div className="text-sm mt-1">{check.message}</div>
              {check.recommendation && (
                <div className="text-xs text-primary bg-primary/5 p-3 rounded-md border border-primary/10 flex gap-2 items-start mt-1">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{check.recommendation}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
