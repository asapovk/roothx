import { combineReducers } from 'redux';
//import { composeSlice } from '../compose/compose.config';
//import { lettersSlice } from '../letters/letters.config';
import { notificationSlice } from '../notification/notification.config';
import { popupSlice } from '../popup/popup.config';
//import { sidebarSlice } from '../folders/folders.config';
import { appSlice } from '../app/app.config';

export const reducers = {
   //...lettersSlice.reducer,
  //...settingsSlice.reducer,
  //...composeSlice.reducer,
  ...notificationSlice.reducer,
  ...popupSlice.reducer,
  //...sidebarSlice.reducer,
  ...appSlice.reducer,
}



// import('../letters/letters.config' ).then( module => {
//   //@ts-ignore
//   reducers['letters'] = module.default.reducer;
// })


//export default rootReducer;
