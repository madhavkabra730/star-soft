"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button/Button";
import styles from "./not-found.module.scss";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>Ops!</h1>
      <p className={styles.message}>Algo deu errado ao carregar esta página.</p>
      <Button variant="primary" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
