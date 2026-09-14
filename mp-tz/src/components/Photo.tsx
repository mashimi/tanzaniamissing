// eslint-disable-next-line @next/next/no-img-element
export default function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const proxied = /^https?:\/\//i.test(src)
    ? `/img?url=${encodeURIComponent(src)}`
    : src;
  return <img src={proxied} alt={alt} loading="lazy" className={className} />;
}
