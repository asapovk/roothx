import { Store } from 'redux';
import { IComposeState, IComposeTriggers } from '../compose/compose.config';
import { ILettersState, ILettersTriggers } from '../letters/letters.config';
import {
  INotificationState,
  INotificationTriggers,
} from '../notification/notification.config';
import { IPopupState, IPopupTriggers } from '../popup/popup.config';
import {
  IFoldersState,
  IFoldersTriggers,
} from '../folders/interfaces/Folder.interface';
import { IAppState, IAppTrigges } from '../app/app.config';
// import {
//   ISettingsState,
//   ISettingsTriggers,
// } from 'src/settings/settings.config';

export type IState = {
  letters: ILettersState;
  //settings: ISettingsState;
  compose: IComposeState;
  notification: INotificationState;
  popup: IPopupState;
  folders: IFoldersState;
  app: IAppState;
};

export type ITriggers = ILettersTriggers &
  // ISettingsTriggers &
  IComposeTriggers &
  INotificationTriggers &
  IPopupTriggers &
  IAppTrigges &
  IFoldersTriggers;
