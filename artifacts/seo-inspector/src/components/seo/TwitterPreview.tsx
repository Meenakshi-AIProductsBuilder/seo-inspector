import { TwitterPreview as TwitterPreviewType } from "@workspace/api-client-react";
import { Image as ImageIcon } from "lucide-react";

interface Props {
  data: TwitterPreviewType;
}

export function TwitterPreview({ data }: Props) {
  const isLarge = data.card === "summary_large_image";
  const displayTitle = data.title || "No Title Provided";
  const displayDesc = data.description || "No description provided.";
  const displayDomain = "example.com"; // Twitter extracts from URL

  return (
    <div className="max-w-[500px] border border-[#333639] rounded-2xl overflow-hidden font-sans bg-transparent">
      {isLarge ? (
        // Large Image Card
        <div className="flex flex-col">
          <div className="w-full aspect-[1.91/1] bg-[#16181C] flex items-center justify-center border-b border-[#333639] relative overflow-hidden">
            {data.image ? (
               <img src={data.image} alt={displayTitle} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-[#71767B]" />
            )}
          </div>
          <div className="p-3">
            <div className="text-[15px] text-[#E7E9EA] truncate leading-tight">
              {displayTitle}
            </div>
            <div className="text-[15px] text-[#71767B] truncate mt-0.5">
              {displayDesc}
            </div>
            <div className="text-[15px] text-[#71767B] flex items-center gap-1 mt-0.5">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.125-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.073 1.055-3.225 1.055z"></path></g></svg>
              {displayDomain}
            </div>
          </div>
        </div>
      ) : (
        // Summary (Small) Card
        <div className="flex h-[130px]">
          <div className="w-[130px] h-full bg-[#16181C] flex items-center justify-center border-r border-[#333639] shrink-0">
            {data.image ? (
               <img src={data.image} alt={displayTitle} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-[#71767B]" />
            )}
          </div>
          <div className="p-3 flex flex-col justify-center min-w-0 flex-1">
            <div className="text-[15px] text-[#E7E9EA] truncate leading-tight">
              {displayTitle}
            </div>
            <div className="text-[15px] text-[#71767B] line-clamp-2 mt-0.5">
              {displayDesc}
            </div>
            <div className="text-[15px] text-[#71767B] flex items-center gap-1 mt-0.5 truncate">
               <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current shrink-0"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.125-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.073 1.055-3.225 1.055z"></path></g></svg>
               <span className="truncate">{displayDomain}</span>
            </div>
          </div>
        </div>
      )}
      <div className="px-3 pb-2 text-[13px] text-[#71767B] font-mono border-t border-[#333639] pt-2 mt-2 bg-[#16181C]">
        Type: {data.card || "summary"}
      </div>
    </div>
  );
}
