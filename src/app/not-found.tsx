import Link from "next/link";
import { Button } from "@/components/Button/Button";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Este NFT não existe ou foi removido.</p>
      <Link href="/">
        <Button variant="primary">Voltar para a loja</Button>
      </Link>
    </div>
  );
}
