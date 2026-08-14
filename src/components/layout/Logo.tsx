import Image from "next/image";

export default function Logo({
  width = 50,
  height = 50,
  ...props
}: Omit<React.ComponentProps<typeof Image>, "alt" | "src">) {
  return (
    <Image
      alt="ShootMania Obstacle logo"
      src="/img/obs_logo.svg"
      width={width}
      height={height}
      priority
      {...props}
    />
  );
}
