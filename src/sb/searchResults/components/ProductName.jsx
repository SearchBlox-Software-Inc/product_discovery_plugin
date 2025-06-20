import PropTypes from 'prop-types';

import { productFields, pdfOverlay } from '../../common/Defaults';
import useRecommendationsStore from '../../../stores/recommendationsStore';
import { getDocumentClickCount } from '../../common/SbCore';

import styles from '../styles/resultItem.module.scss';


// ==============================================================================================


const { name: NAME_FIELD, url: URL_FIELD } = productFields;


// ----------------------------------------------------------------------------------------------


function ProductName({ result, setOverlayResult, setOverlayShown }) {

   const updateRecentResultClicks = useRecommendationsStore(state => state.updateRecentResultClicks);

   const isDB = ['db', 'csv', 'mongodb', 'product_discovery'].includes(result.contenttype.toLowerCase());
   const isPDF = pdfOverlay && 
      result.contenttype.toLowerCase() === 'pdf' && 
      !result[URL_FIELD].startsWith('/') &&
      !result[URL_FIELD].startsWith('\\') &&
      !result[URL_FIELD].startsWith('db') &&
      result[URL_FIELD][1] !== ':';


   // ------------------------------

   
   function handleClick(e) {
      if (isPDF || isDB || result.isStructured) {
         e.preventDefault();
         setOverlayResult(result);
         setOverlayShown(true);

         if (isPDF) {
            getDocumentClickCount(result);
         }
      } else {
         getDocumentClickCount(result);
      }

      updateRecentResultClicks(result[NAME_FIELD]);
   }


   // ------------------------------
   

   return (
      <a
         href={!(isDB || isPDF || result.isStructured) ? result[URL_FIELD] : ''}
         className={styles.resultTitle}
         dangerouslySetInnerHTML={{ __html: result[NAME_FIELD] || result.title || 'Product name not available' }}
         target="_blank"
         rel="noreferrer"
         onClick={handleClick}
      />
   );
}


ProductName.propTypes = {
   result: PropTypes.object.isRequired,
   setOverlayResult: PropTypes.func.isRequired,
   setOverlayShown: PropTypes.func.isRequired
};


export default ProductName; 