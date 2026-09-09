import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllProductIds, getProductById } from "@/lib/products";
import { BuySection } from "./BuySection";
import styles from "./page.module.scss";

interface NftPageProps {
  params: Promise<{ id: string }>;
}

// Pre-render every known NFT at build time (SSG).
export async function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: NftPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) return { title: "NFT não encontrado" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function NftDetailPage({ params }: NftPageProps) {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Voltar
      </Link>

      <div className={styles.layout}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.date}>
            Criado em {new Date(product.createdAt).toLocaleDateString("pt-BR", { dateStyle: "long" })}
          </p>

          <BuySection product={product} />
        </div>
      </div>
    </div>
  );
}
