import Image from "next/image";
import { BRAND_IDENTITY } from "@/constants/tactical";
import type { BrandMarkProps } from "@/types";

export function BrandMark({ className = "", label = "" }: BrandMarkProps) {
  return (
    <Image
      src={BRAND_IDENTITY.markPath}
      width={BRAND_IDENTITY.markSize}
      height={BRAND_IDENTITY.markSize}
      alt={label}
      className={className}
      priority
    />
  );
}
