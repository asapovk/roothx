import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { composeSlice } from '..//compose/compose.config';
import { sidebarSlice } from '../folders/folders.config';
import { lettersSlice } from '../letters/letters.config';
import { notificationSlice } from '..//notification/notification.config';
import { popupSlice } from '../popup/popup.config';
import { appSlice } from '../app/app.config';
//import { settingsSlice } from 'src/settings/settings.config';
import rootReducer from './reducer';
import { System, useSystem } from '@reflexio/reflexio-on-redux/lib/System';

function configureStore() {
  const middlewares: Middleware[] = [
    lettersSlice.middleware,
    //  settingsSlice.middleware,
    composeSlice.middleware,
    notificationSlice.middleware,
    popupSlice.middleware,
    sidebarSlice.middleware,
    appSlice.middleware,
  ];

  const store = createStore(
    rootReducer,
    compose(applyMiddleware(...middlewares))
  );

  store.subscribe;

  return store;
}
const system = useSystem();

//system.afterHandlers.forEach( ah => store.subscribe(ah))
const store = configureStore();
store.subscribe(() => {
  system.afterHandlers.forEach((s) => s());
});
//@ts-ignore
store.system = system;
export const dispatch = store.dispatch;
export default store;
