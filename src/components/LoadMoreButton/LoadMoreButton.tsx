import { Button } from "@/components/Button/Button";
import styles from "./LoadMoreButton.module.scss";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  progress: number;
}

export function LoadMoreButton({ onClick, isLoading, hasMore, progress }: LoadMoreButtonProps) {
  const fill = Math.min(1, Math.max(0, progress));

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(fill * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.fill} style={{ width: `${fill * 100}%` }} />
      </div>

      {hasMore ? (
        <Button
          variant="neutral"
          onClick={onClick}
          disabled={isLoading}
          fullWidth
          className={styles.loadMore}
        >
          {isLoading ? "Carregando..." : "Carregar mais"}
        </Button>
      ) : (
        <Button variant="neutral" disabled fullWidth className={styles.loadMore}>
          Você já viu tudo
        </Button>
      )}
    </div>
  );
}
