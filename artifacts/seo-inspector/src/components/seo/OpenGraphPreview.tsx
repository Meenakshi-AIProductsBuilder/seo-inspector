import { OpenGraphPreview as OpenGraphPreviewType } from "@workspace/api-client-react";
import { Image as ImageIcon } from "lucide-react";

interface Props {
  data: OpenGraphPreviewType;
}

export function OpenGraphPreview({ data }: Props) {
  const displayTitle = data.title || "No Title Provided";
  const displayDesc = data.description || "No description provided.";
  const displayDomain = data.url ? new URL(data.url).hostname : "example.com";

  return (
    <div className="max-w-[500px] bg-[#18191A] border border-[#3E4042] rounded-lg overflow-hidden shadow-sm font-sans">
      <div className="w-full aspect-[1.91/1] bg-[#242526] flex items-center justify-center border-b border-[#3E4042] relative overflow-hidden">
        {data.image ? (
          <img src={data.image} alt={displayTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-[#B0B3B8]">
            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-mono">No og:image</span>
          </div>
        )}
      </div>
      <div className="p-4 bg-[#242526]">
        <div className="text-[12px] text-[#B0B3B8] uppercase tracking-wider mb-1 truncate">
          {displayDomain}
        </div>
        <div className="text-[16px] font-semibold text-[#E4E6EB] leading-tight mb-1 truncate">
          {displayTitle}
        </div>
        <div className="text-[14px] text-[#B0B3B8] leading-snug line-clamp-2">
          {displayDesc}
        </div>
      </div>
    </div>
  );
}
