import { Image } from "@heroui/react";

interface ImageProps {
  src: string;
  alt?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
  loading?: "lazy" | "eager";
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  isBlurred?: boolean;
  isZoomed?: boolean;
  removeWrapper?: boolean;
}

const CustomImage = ({
  src = "https://via.placeholder.com/150",
  alt = "Image",
  radius = "md",
  shadow = "none",
  loading = "lazy",
  removeWrapper = false,
  width = 150,
  height = 150,
  fallbackSrc = "https://via.placeholder.com/150",
  className,
  ...props
}: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fallbackSrc={fallbackSrc}
      radius={radius}
      shadow={shadow}
      loading={loading}
      removeWrapper={removeWrapper}
      className={className}
      {...props}
    />
  );
};

export default CustomImage;
