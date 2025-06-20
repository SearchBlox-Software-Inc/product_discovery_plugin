import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';

import useSearchStore from '../../stores/searchStore';
import * as defaults from '../common/Defaults';

import AssistButton from '../aiAssist/AssistButton';
import ProductCategory from './components/ProductCategory';
import ProductDescription from './components/ProductDescription';
import ProductImage from './components/ProductImage';
import ProductName from './components/ProductName';
import ProductPrice from './components/ProductPrice';

import styles from './styles/resultItem.module.scss';


// ==============================================================================================


dayjs.extend(utc);
dayjs.extend(LocalizedFormat);


const {
   image: IMAGE_FIELD,
   description: DESCRIPTION_FIELD,
   price: PRICE_FIELD,
   category: CATEGORY_FIELD
} = defaults.productFields;


// ----------------------------------------------------------------------------------------------


function ResultItem({ result, highlight, setOverlayResult, setOverlayShown, recommendation = false }) {

   const isGridView = useSearchStore(state => state.isGridView);
   const description = result[DESCRIPTION_FIELD] || result.description || 'Product description not available';


   return (
      <div className={`${styles.result} ${highlight ? '' : 'no-highlight'} ${isGridView ? styles.gridView : styles.listView} ${recommendation ? styles.recommendation : ''}`}>
         {
            isGridView ? (
               <>
                  <div className={styles.resultContent}>
                     <ProductImage image={result[IMAGE_FIELD] || result['og:image']} />
                     <ProductName 
                        result={result} 
                        setOverlayResult={setOverlayResult}
                        setOverlayShown={setOverlayShown}
                     />
                     <ProductCategory category={result[CATEGORY_FIELD]} />
                     <ProductDescription description={description} />
                  </div>
                  <div className={styles.priceContainer}>
                     <ProductPrice price={result[PRICE_FIELD]} />
                     <AssistButton result={result} />
                  </div>
               </>
            ) : (
               <>
                  <ProductImage image={result[IMAGE_FIELD] || result['og:image']} />
                  <div className={styles.resultContent}>
                     <ProductName 
                        result={result}
                        setOverlayResult={setOverlayResult}
                        setOverlayShown={setOverlayShown}
                     />
                     <ProductCategory category={result[CATEGORY_FIELD]} />
                     <ProductDescription description={description} />
                     <div className={styles.priceContainer}>
                        <ProductPrice result={result} />
                        <AssistButton result={result} />
                     </div>
                  </div>
               </>
            )
         }
         
         
      </div>
   );
}


export default ResultItem;


ResultItem.propTypes = {
   result: PropTypes.object,
   highlight: PropTypes.bool,
   setOverlayResult: PropTypes.func,
   setOverlayShown: PropTypes.func,
   recommendation: PropTypes.bool
};