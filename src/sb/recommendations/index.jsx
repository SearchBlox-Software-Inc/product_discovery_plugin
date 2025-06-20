import { useMutation } from '@tanstack/react-query';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import useSearchStore from '../../stores/searchStore';
import { defaultCollections as COLLECTIONS, recommendations as RECOMMENDATIONS_DEFAULTS } from '../common/Defaults';

import useRecommendationsStore from '../../stores/recommendationsStore';
import useSecurityStore from '../../stores/securityStore';
import { getDocumentClickCount, getRecommendations } from '../common/SbCore';

import ResultItem from '../searchResults/ResultItem';
import RecommendationNotification from './RecommendationNotification';

import styles from './styles/recommendations.module.scss';


// ==============================================================================================


function Recommendations() {

   const [previousRecommendations, setPreviousRecommendations] = useState([]);
   const [showNotification, setShowNotification] = useState(false);

   
   const securityResponse = useSecurityStore(state => state.securityResponse);

   const recentResultClicks = useRecommendationsStore(state => state.recentResultClicks);
   const setRecentResultClicks = useRecommendationsStore(state => state.setRecentResultClicks); 
   const updateRecentResultClicks = useRecommendationsStore(state => state.updateRecentResultClicks);
   const recommendations = useRecommendationsStore(state => state.recommendations);
   const setRecommendations = useRecommendationsStore(state => state.setRecommendations);
   const userInitiatedClick = useRecommendationsStore(state => state.userInitiatedClick);


   // ------------------------------


   useEffect(() => {
      const storedTitles = sessionStorage.getItem('recentlyClickedTitles');

      if (storedTitles) {
         setRecentResultClicks(JSON.parse(storedTitles));
      }
   }, []);


   useEffect(() => {
      
      sessionStorage.setItem('recentlyClickedTitles', JSON.stringify(recentResultClicks));

      // Only trigger recommendationsMutation if there are 3+ titles AND it's a user-initiated change 
      // TODO: find a better way to avoid rerendering
      if (recentResultClicks.length >= 3 && userInitiatedClick) {
         recommendationsMutation.mutate({
            titles: recentResultClicks,
         });
      }
   }, [recentResultClicks, userInitiatedClick]);


   // ------------------------------


   const recommendationsMutation = useMutation({
      mutationFn: async ({ titles }) => {
         const urlParameters = queryString.parse(window.location.search);
         const { cname } = urlParameters;

         const securityEnabled = !(securityResponse && securityResponse.type === 'none');

         const response = await getRecommendations({
            data: {  
               viewedPageTitles: titles,
               numberOfRecommendations: RECOMMENDATIONS_DEFAULTS.limit,
               ...(cname ? { cname: [cname] } : { col: COLLECTIONS })
            },
            securityEnabled
         });
         
         return response.data;
      },
      onSuccess: (data) => {
         if (data.recommendations.length) {
            setPreviousRecommendations(recommendations);
            setRecommendations(data.recommendations);
            setShowNotification(true);

         setTimeout(() => {
               setShowNotification(false);
            }, 5000);
         }
      },
      onError: (error) => {
         console.error('Error generating new title for recommendations: ', error);
      }
   });


   // ------------------------------


   function handleClick(e, result) {
      e.preventDefault();
      getDocumentClickCount(result);
      updateRecentResultClicks(result.title);
   }

   
   // ------------------------------


   if (recommendations.length === 0 && !recommendationsMutation.isPending) {
      return null;
   }


   return (
      <>
         {
            recommendationsMutation.isPending &&
            <span className={styles.ollamaLoading}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="10" height="10" x="1" y="1" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle30" fill="freeze" attributeName="x" begin="0;svgSpinnersBlocksShuffle3b.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle31" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle38.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle32" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle39.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle33" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle3a.end" dur="0.2s" values="13;1" /></rect><rect width="10" height="10" x="1" y="13" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle34" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle30.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle35" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle31.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle36" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle32.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle37" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle33.end" dur="0.2s" values="13;1" /></rect><rect width="10" height="10" x="13" y="13" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle38" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle34.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle39" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle35.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle3a" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle36.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle3b" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle37.end" dur="0.2s" values="1;13" /></rect></svg>
            </span>
         }

         <RecommendationNotification show={showNotification} />

         {
            recommendations.length > 0 &&
               recommendations.map((result, index) => {
                  const isNew = previousRecommendations.length > 0 && !previousRecommendations.some(prev => prev.uid === result.uid);
                  // const positionChanged = previousRecommendations.findIndex(prev => prev.uid === result.uid) !== index;

                  return (
                     <li key={`recommendation-${index}`} className={`${isNew ? styles.newRecommendation : ''} `} style={{ position: 'relative' }}>
                        <span className={`${styles.recommendationLabel} ${isNew ? styles.new : ''}`}>
                           Recommended {isNew ? <span className={styles.newLabel}>New</span> : null}
                        </span>

                        <ResultItem result={result} recommendation={true} />
                     </li>
                  );
               })
         }
      </>
   );
}


export default Recommendations;