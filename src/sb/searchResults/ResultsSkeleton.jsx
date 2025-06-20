import useSearchStore from '../../stores/searchStore';
import SkeletonItem from '../basicComponents/skeletonItem/';

import styles from './styles/resultsSkeleton.module.scss'


// ==========================================================================================


function ResultsSkeleton({count = 3}) {

   const isGrid = useSearchStore(state => state.isGridView);


   // ------------------------------

   if (isGrid) {
      return (
         <div className={styles.resultSkeletonGrid}>
            {
               Array.from({ length: count }).map((_, i) => (
                  <div key={i} className={`${styles.resultSkeleton} ${styles.gridView}`}>
                     <SkeletonItem className={styles.skeletonImage} />
                     <div className={styles.skeletonContent}>
                        <SkeletonItem className={styles.skeletonTitle} />
                        <SkeletonItem className={styles.skeletonDescription} />
                        <SkeletonItem className={styles.skeletonDescription} />
                        <SkeletonItem className={styles.skeletonUrl} />
                     </div>
                  </div>
               ))
            }
         </div>
      )
   }


   return (
      <>
         {
            Array.from({ length: count }).map((_, i) => (
               <div className={styles.resultSkeleton}>
                  <div className={styles.skeletonContent}>
                     <SkeletonItem className={styles.skeletonTitle} />
                     <SkeletonItem className={styles.skeletonDescription} />
                     <SkeletonItem className={styles.skeletonDescription} />
                     <SkeletonItem className={styles.skeletonUrl} />
                  </div>
                  <SkeletonItem className={styles.skeletonImage} />
               </div>
            ))
         }
      </>
   );
}


export default ResultsSkeleton;