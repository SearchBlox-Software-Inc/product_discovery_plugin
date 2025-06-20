import PropTypes from 'prop-types';
import * as defaults from '../../common/Defaults';

import styles from '../styles/resultItem.module.scss';


// ==============================================================================================


const { category: CATEGORY_FIELD } = defaults.productFields;


// ----------------------------------------------------------------------------------------------


function ProductCategory({ category }) {
   if (!category)
      return null;

   return (
      <p className={styles.resultCategory}>
         {category}
      </p>
   );
}


ProductCategory.propTypes = {
   category: PropTypes.string.isRequired
};


export default ProductCategory; 