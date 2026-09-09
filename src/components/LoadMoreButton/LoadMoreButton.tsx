import { Button } from "@/components/Button/Button";
import styles from "./LoadMoreButton.module.scss";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

/** The "load-bt": Carregar mais -> loading -> Você já viu tudo (disabled) once every page has been fetched. */
export function LoadMoreButton({ onClick, isLoading, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <Button variant="ghost" disabled className={styles.loadMore}>
        Você já viu tudo
      </Button>
    );
  }

  return (
    <Button variant="secondary" onClick={onClick} disabled={isLoading} className={styles.loadMore}>
      {isLoading ? "Carregando..." : "Carregar mais"}
    </Button>
  );
}
