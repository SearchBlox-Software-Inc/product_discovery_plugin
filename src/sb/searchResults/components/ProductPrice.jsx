import PropTypes from 'prop-types';

import styles from '../styles/resultItem.module.scss';


// ==============================================================================================


function ProductPrice({ price }) {
      
   return (
      <p className={styles.resultPrice} title={`Price ${!price ? 'not available' : ''}`}>
         {
            !price ? <span style={{ fontSize: '16px' }}>N/A</span> : price
         }
      </p>
   );
}


ProductPrice.propTypes = {
   price: PropTypes.string.isRequired
};


export default ProductPrice; 