import { IState, ITriggers } from '../../src/_redux/types';
import { Bite, Slice } from '@reflexio/reflexio-on-redux/lib';
import { TriggerPhaseWrapper } from '@reflexio/reflexio-on-redux/lib/types';
import { OpenPopupScript } from './scripts/OpenPopup.script';

export interface IPopupState {
  isOpen: boolean;
  content: string;
}

export interface IPopupTriggers {
  openPopup: TriggerPhaseWrapper<{
    init: {
      message: string;
      // yesCb?: () => void;
      // noCb?: () => void;
      // cancelCb?: () => void;
    };
    open: null;
    close: null;
    yes: null;
    no: null;
    cancel: null;
  }>;
}

export const popupInitialState: IPopupState = {
  content: 'dummy content',
  isOpen: false,
};

const openPopupBite = Bite<
  IPopupTriggers,
  ITriggers,
  IPopupState,
  IState,
  'openPopup'
>(
  {
    init: (state, payload) => {
      state.content = payload.message;
    },
    open: (state, payload) => {
      state.isOpen = true;
    },
    close: (state, payload) => {
      state.isOpen = false;
    },
    yes: null,
    no: null,
    cancel: null,
  },
  {
    canTrigger: ['openPopup'],
    updateOn: ['openPopup'],
    instance: 'stable',
    script: OpenPopupScript,
    triggerStatus: 'init',
  }
);

export const popupSlice = Slice<IPopupTriggers, ITriggers, IPopupState, IState>(
  'popup',
  {
    openPopup: openPopupBite,
  },
  popupInitialState
);
