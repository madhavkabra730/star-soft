import styles from "./page.module.scss";
import skeletonStyles from "./loading.module.scss";

export default function NftDetailLoading() {
  return (
    <div className={styles.page} aria-hidden>
      <div className={skeletonStyles.backSkeleton} />

      <div className={styles.layout}>
        <div className={skeletonStyles.imageSkeleton} />

        <div className={skeletonStyles.info}>
          <div className={`${skeletonStyles.line} ${skeletonStyles.title}`} />
          <div className={`${skeletonStyles.line} ${skeletonStyles.textLong}`} />
          <div className={`${skeletonStyles.line} ${skeletonStyles.textMid}`} />
          <div className={`${skeletonStyles.line} ${skeletonStyles.textLong}`} />
          <div className={`${skeletonStyles.line} ${skeletonStyles.textShort}`} />
          <div className={`${skeletonStyles.line} ${skeletonStyles.button}`} />
        </div>
      </div>
    </div>
  );
}
