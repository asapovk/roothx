import { Bite, Slice } from '@reflexio/reflexio-on-redux';
import { TriggerPhaseWrapper } from '@reflexio/reflexio-on-redux/lib/types';
import { IState, ITriggers } from '../_redux/types';
import { DialogScript } from './scripts/Dialog.script';
import { AppControllerScript } from './scripts/App.script';

export interface IAppState {
  sizeMode: '3col' | '2col' | '1col' | 'undefined';
  isReady: boolean;
  dialog?: {
    isOpen: boolean;
  };
}

export interface IAppTrigges {
  appController: TriggerPhaseWrapper<{
    init: null;
    setSizeMode: '3col' | '2col' | '1col' | 'undefined';
    setReadiness: boolean;
  }>;
  dialog: TriggerPhaseWrapper<{
    init: () => void;
    clickBackgroud: null;
    openDialog: null;
    closeDialog: null;
  }>;
}

export const appControllerState: IAppState = {
  isReady: false,
  sizeMode: 'undefined',
};

const appControllerBite = Bite<
  IAppTrigges,
  ITriggers,
  IAppState,
  IState,
  'appController'
>(
  {
    init: null,
    setReadiness: null,
    setSizeMode(state, payload) {
      state.sizeMode = payload;
    },
  },
  {
    canTrigger: ['appController'],
    updateOn: ['appController'],
    instance: 'stable',
    script: AppControllerScript,
    triggerStatus: 'init',
  }
);

const dialogBite = Bite<IAppTrigges, ITriggers, IAppState, IState, 'dialog'>(
  {
    init: null,
    clickBackgroud: null,
    openDialog(state, payload) {
      state.dialog = {
        isOpen: true,
      };
    },
    closeDialog(state, payload) {
      state.dialog = {
        isOpen: false,
      };
    },
  },
  {
    canTrigger: ['dialog'],
    updateOn: ['dialog'],
    instance: 'stable',
    script: DialogScript,
    triggerStatus: 'init',
  }
);

export const appSlice = Slice<IAppTrigges, ITriggers, IAppState, IState>(
  'app',
  {
    appController: appControllerBite,
    dialog: dialogBite,
  },
  appControllerState
);
