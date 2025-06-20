import PropTypes from 'prop-types';
import { useState } from 'react';

import styles from '../styles/resultItem.module.scss';


// ==============================================================================================


function ProductImage({ image }) {

   const [thumbnailError, setThumbnailError] = useState(false);


   if (!image || thumbnailError) {
      return (
         <div className={styles.resultThumbnailPlaceholder}>
            <p>
               <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-photo-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path d="M13 21h-7a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>
               <span>Image unavailable</span>
            </p>
         </div>
      );
   }


   return (
      <div className={styles.resultThumbnail}>
         <img
            src={image}
            alt="Product Image"
            loading="lazy"
            onError={() => setThumbnailError(true)}
         />
      </div>
   );
}


ProductImage.propTypes = {
   image: PropTypes.string.isRequired
};


export default ProductImage; 