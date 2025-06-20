import { assist } from '../common/Defaults';
import usePluginSettingsStore from '../../stores/pluginSettingsStore';
import useAssistStore from '../../stores/assistStore';

import assistButtonStyles from './styles/assistButton.module.scss';


// ==============================================================================================


const UNSUPPORTED_CONTENT_TYPES = ['mpeg', 'mp4', 'flv', 'mpg', 'mp3', 'gif', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma', 'm4b', 'm4p', 'm4b', 'm4p', 'aiff', 'aif', 'aiffc', 'aifc', 'mid'];
function AssistButton({ result }) {

   const assistEnabled = usePluginSettingsStore(state => state.assistEnabled);

   const selectedResults = useAssistStore(state => state.selectedResults);
   const toggleResultForAssist = useAssistStore(state => state.toggleSelectedResult);


   // ------------------------------


   const assistHidden = UNSUPPORTED_CONTENT_TYPES.includes(result.contenttype.toLowerCase()) || !assist.enabled || !assistEnabled;
   const isSelectedForAssist = selectedResults?.some(selectedResult => selectedResult.uid === result.uid && selectedResult.url === result.url && selectedResult.title === result.title);
   const assistDisabled = !isSelectedForAssist && selectedResults?.length >= assist.limit;


   if (assistHidden) {
      return null;
   }


   return (
      <button
         className={`${assistButtonStyles.assistBtn} ${isSelectedForAssist ? assistButtonStyles.active : (assistDisabled ? assistButtonStyles.disabled : '')}`}
         onClick={() => toggleResultForAssist(result)}
         disabled={assistDisabled}
         title={assistDisabled ? 'Assist disabled' : (isSelectedForAssist ? 'Remove from Assist' : 'Add to Assist')}
      >
         {
            isSelectedForAssist ?
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
               :
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cpu"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" /><path d="M9 9h6v6h-6z" /><path d="M3 10h2" /><path d="M3 14h2" /><path d="M10 3v2" /><path d="M14 3v2" /><path d="M21 10h-2" /><path d="M21 14h-2" /><path d="M14 21v-2" /><path d="M10 21v-2" /></svg>
         }
         SearchAI Assist
      </button>
   );
}


export default AssistButton;