import { useState } from 'react';
import PropTypes from 'prop-types';

import { getSBResponse } from './../common/SbCore';

import Overlay from '../basicComponents/overlay';

import commonStyles from '../css/common.module.scss';
import styles from './styles/citationLinks.module.scss';
import overlayStyles from './../basicComponents/overlay/styles/overlayTable.module.scss';


// ==========================================================================================


const IGNORED_DB_FIELDS = [
   'score', 'raw_score', 'contenttype', 
   'indexdate', 'no', 'old_uid', 
   'sb_boost', 'sortdate', 'url', 
   'crawldate', 'context', 'title', 
   'lastmodified', 'source', 'uid',
   'sbid', 'language', 'description',
   'col', 'colname', 'keywords'
];

const DB_URL_PREFIX = 'db?url=';


// ------------------------------


export default function CitationLinks({ sources }) {

   const [loading, setLoading] = useState(false);
   const [dataFields, setDataFields] = useState({});
   const [dbModalShown, showDBModal] = useState(false);


   // ------------------------------

   
   function handleDBSourceClick(source) {
      setLoading(true);
      showDBModal(true);

      getSBResponse({ query: source, page: 1, public: true })
         .then(response => {
            if (response.status === 200 && response.data && response.data.result && response.data.result.length) {
               const fields = response.data.result[0];
               const sortedKeys = Object.keys(fields).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })); //sort alphabetically while being case insensitive
               const sortedFields = {};

               sortedKeys.forEach(key => {
                  sortedFields[key] = fields[key];
               });

               setDataFields(sortedFields);
            }
         }).catch(error => {
            //eslint-disable-next-line
            console.error(error);
         })
         .finally(() => setLoading(false));
   }


   // ------------------------------

   
   if(!sources)
      return null;
   
   
   return (
      <>
         {
            sources.map((source, i) => {
               const sourceIsDB = source.length && source.includes(DB_URL_PREFIX);
               const currentSource = sourceIsDB ? source.replace(DB_URL_PREFIX, '') : encodeURI(source);

               if (!currentSource.trim().length)
                  return null;

               if (sourceIsDB) {
                  return (
                     <button key={`source-${i}`} title={currentSource} onClick={() => handleDBSourceClick(currentSource)} className={styles.citation}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-blockquote"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h15" /><path d="M21 19h-15" /><path d="M15 11h6" /><path d="M21 7h-6" /><path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" /><path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" /></svg>
                     </button>
                  );
               }
                  
               return (
                  <a href={currentSource} target="_blank" key={`source-${i}`} title={currentSource} className={styles.citation} rel="noreferrer">
                     <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-blockquote"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h15" /><path d="M21 19h-15" /><path d="M15 11h6" /><path d="M21 7h-6" /><path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" /><path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" /></svg>
                  </a>
               );
            })
         }

         <Overlay open={dbModalShown}>
            <Overlay.Title onClose={() => showDBModal(false)}>
               {
                  loading ? 
                     null
                     :
                     <>
                        {dataFields.uid}{dataFields.colname ? ` | ${dataFields.colname}` : ''}
                     </>
               } 
            </Overlay.Title>
            
            <Overlay.Content>
               {
                  loading ? 
                     <svg className={commonStyles.loadingSpinner} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 .75c.172 0 .333.034.484.102a1.214 1.214 0 0 1 .664.664c.068.15.102.312.102.484s-.034.333-.102.484a1.214 1.214 0 0 1-.265.399 1.324 1.324 0 0 1-.399.273A1.254 1.254 0 0 1 8 3.25c-.172 0-.333-.031-.484-.094a1.324 1.324 0 0 1-.672-.672A1.254 1.254 0 0 1 6.75 2c0-.172.031-.333.094-.484.067-.151.159-.284.273-.399.115-.114.248-.203.399-.265A1.17 1.17 0 0 1 8 .75zM2.633 3.758a1.111 1.111 0 0 1 .68-1.031 1.084 1.084 0 0 1 .882 0c.136.057.253.138.352.242.104.099.185.216.242.351a1.084 1.084 0 0 1 0 .883 1.122 1.122 0 0 1-.594.594 1.169 1.169 0 0 1-.883 0 1.19 1.19 0 0 1-.359-.234 1.19 1.19 0 0 1-.234-.36 1.169 1.169 0 0 1-.086-.445zM2 7a.941.941 0 0 1 .703.297A.941.941 0 0 1 3 8a.97.97 0 0 1-.078.39 1.03 1.03 0 0 1-.531.532A.97.97 0 0 1 2 9a.97.97 0 0 1-.39-.078 1.104 1.104 0 0 1-.32-.211 1.104 1.104 0 0 1-.212-.32A.97.97 0 0 1 1 8a.97.97 0 0 1 .29-.703A.97.97 0 0 1 2 7zm.883 5.242a.887.887 0 0 1 .531-.805.863.863 0 0 1 .68 0c.11.047.203.11.281.188a.887.887 0 0 1 .188.96.887.887 0 0 1-1.148.461.913.913 0 0 1-.462-.46.863.863 0 0 1-.07-.344zM8 13.25c.208 0 .385.073.531.219A.723.723 0 0 1 8.75 14a.723.723 0 0 1-.219.531.723.723 0 0 1-.531.219.723.723 0 0 1-.531-.219A.723.723 0 0 1 7.25 14c0-.208.073-.385.219-.531A.723.723 0 0 1 8 13.25zm3.617-1.008c0-.177.06-.325.18-.445s.268-.18.445-.18.326.06.445.18c.12.12.18.268.18.445s-.06.326-.18.445a.605.605 0 0 1-.445.18.605.605 0 0 1-.445-.18.605.605 0 0 1-.18-.445zM14 7.5a.48.48 0 0 1 .352.148A.48.48 0 0 1 14.5 8a.48.48 0 0 1-.148.352A.48.48 0 0 1 14 8.5a.48.48 0 0 1-.352-.148A.48.48 0 0 1 13.5 8a.48.48 0 0 1 .148-.352A.48.48 0 0 1 14 7.5zm-1.758-5.117c.188 0 .365.036.531.11a1.413 1.413 0 0 1 .735.734c.073.166.11.343.11.53 0 .188-.037.365-.11.532a1.413 1.413 0 0 1-.735.734 1.31 1.31 0 0 1-.53.11c-.188 0-.365-.037-.532-.11a1.415 1.415 0 0 1-.734-.734 1.31 1.31 0 0 1-.11-.531c0-.188.037-.365.11-.531a1.413 1.413 0 0 1 .734-.735c.167-.073.344-.11.531-.11z" /></svg>
                     :
                     <table className={overlayStyles.sbDbFields}>
                        <tbody>
                           {
                              Object.keys(dataFields).length ? 
                                 Object.keys(dataFields).map((key, j) => {
                                    const fieldValue = dataFields[key]?.toString().length ? dataFields[key] : '-';
                                    
                                    if (!IGNORED_DB_FIELDS.includes(key)) {
                                       return (
                                          <tr key={`field-${j}`}>
                                             <th>{key.toUpperCase()}</th>
                                             <td>{fieldValue}</td>
                                          </tr>
                                       );
                                    }
                                 })
                                 :
                                 <tr>
                                    <td className={overlayStyles.errorItem} colSpan={2}>
                                       <p>
                                          Unable to fetch details of file.
                                       </p>
                                    </td>
                                 </tr>
                           }
                        </tbody>
                     </table>
               }
            </Overlay.Content>
         </Overlay>
      </>
   );
}


CitationLinks.propTypes = {
   sources: PropTypes.array,
};