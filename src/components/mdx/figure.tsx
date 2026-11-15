import Image from "next/image";

type FigureProps = {
  src: string;
  /** Obrigatório: descreve a imagem para quem usa leitor de tela. */
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

/** Imagem com legenda opcional, otimizada pelo next/image. */
export function Figure({ src, alt, caption, width, height }: FigureProps) {
  return (
    <figure className="my-8 flex flex-col gap-2">
      <Image src={src} alt={alt} width={width} height={height} className="rounded-lg border" sizes="(min-width: 768px) 720px, 100vw" />
      {caption ? <figcaption className="text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}
