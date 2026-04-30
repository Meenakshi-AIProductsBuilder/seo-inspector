import { GooglePreview as GooglePreviewType } from "@workspace/api-client-react";
import { Globe } from "lucide-react";

interface Props {
  data: GooglePreviewType;
}

export function GooglePreview({ data }: Props) {
  // Simulate Google's truncation
  const maxTitleLength = 60;
  const maxDescLength = 160;

  const displayTitle = data.title 
    ? (data.title.length > maxTitleLength ? data.title.substring(0, maxTitleLength) + "..." : data.title)
    : "No Title Provided";

  const displayDesc = data.description
    ? (data.description.length > maxDescLength ? data.description.substring(0, maxDescLength) + "..." : data.description)
    : "No description provided.";

  return (
    <div className="bg-[#202124] rounded-lg p-6 font-sans text-[14px] shadow-sm border border-border/50 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 bg-[#303134] rounded-full flex items-center justify-center overflow-hidden shrink-0">
          {data.favicon ? (
            <img src={data.favicon} alt="favicon" className="w-4 h-4 object-contain" />
          ) : (
            <Globe className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col text-[12px] leading-tight">
          <span className="text-[#e8eaed] truncate max-w-[300px]">Site Name</span>
          <span className="text-[#bdc1c6] truncate max-w-[300px]">{data.url}</span>
        </div>
      </div>
      <h3 className="text-[#8ab4f8] text-[20px] font-medium leading-[1.3] hover:underline cursor-pointer mb-1 truncate">
        {displayTitle}
      </h3>
      <p className="text-[#bdc1c6] leading-[1.58] max-w-[600px] break-words">
        {displayDesc}
      </p>
    </div>
  );
}
