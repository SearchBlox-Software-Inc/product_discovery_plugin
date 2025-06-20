import PropTypes from 'prop-types';

import { productFields } from '../../common/Defaults';
import styles from '../styles/resultItem.module.scss';


// ==============================================================================================


function ProductDescription({ description }) {

   return (
      <p 
         className={styles.resultDescription} 
         dangerouslySetInnerHTML={{ __html: description }}
      />
   );
}


ProductDescription.propTypes = {
   description: PropTypes.string.isRequired
};


export default ProductDescription; 