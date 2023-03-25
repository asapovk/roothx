import { Bite, Slice } from '@reflexio/reflexio-on-redux';
import { TriggerPhaseWrapper } from '@reflexio/reflexio-on-redux/lib/types';
import { IKerbInput, klogin } from '../_api/kerberos';
import { ILoginInput, login } from '../_api/login';
import { IOicTokenInput, IOicTokenResponse, oicToken } from '../_api/oicToken';
import {
  effectiveBite,
  effectiveInitialState,
  EffectiveState,
  EffectiveTrigger,
} from '../../../../src/_redux/effectiveBite';
import { IState } from '../_redux/types';
import { AuthScript } from './scripts/Auth.script';

export interface IAuthState {
  err: {
    loginErr: string | null;
    passwordErr: string | null;
  };
  form: {
    login: string;
    password: string;
  };
  login: EffectiveState<ILoginInput, null, Error>;
  oicToken: EffectiveState<IOicTokenInput, IOicTokenResponse, Error>;
}

export interface IAuthTriggers {
  login: EffectiveTrigger<ILoginInput, null, Error>;
  oicToken: EffectiveTrigger<IOicTokenInput, IOicTokenResponse, Error>;
  klogin: EffectiveTrigger<IKerbInput, null, Error>;
  auth: TriggerPhaseWrapper<{
    init: null;
    focusFiled: {
      field: 'login' | 'password';
    };
    setError: Partial<{
      loginErr: string;
      passwordErr: string;
    }>;
    setForm: Partial<{
      login: string;
      password: string;
    }>;
    signIn: null;
    oicSignIn: null;
    kSignIn: null;
    checkForOicCode: null;
  }>;
}

export const authInitialState: IAuthState = {
  form: {
    login: '',
    password: '',
  },
  err: {
    loginErr: null,
    passwordErr: null,
  },
  login: effectiveInitialState(),
  oicToken: effectiveInitialState(),
};

export const loginBite = effectiveBite(login, 'login');
export const oicTokenBite = effectiveBite(oicToken, 'oicToken');
export const kLoginBite = effectiveBite(klogin, 'oicToken');
export const authBite = Bite<
  IAuthTriggers,
  IAuthTriggers,
  IAuthState,
  IState,
  'auth'
>(
  {
    init: null,
    kSignIn: null,
    focusFiled: null,
    setError: (state, payload) => {
      Object.assign(state.err, payload);
    },
    setForm: (state, payload) => {
      Object.assign(state.form, payload);
    },
    signIn: null,
    oicSignIn: null,
    checkForOicCode: null,
  },
  {
    canTrigger: ['login', 'oicToken', 'auth', 'klogin'],
    updateOn: ['auth', 'oicToken', 'login', 'klogin'],
    triggerStatus: 'init',
    script: AuthScript,
    instance: 'stable',
  }
);

export const authSlice = Slice<
  IAuthTriggers,
  IAuthTriggers,
  IAuthState,
  IState
>(
  'auth',
  {
    klogin: kLoginBite,
    login: loginBite,
    oicToken: oicTokenBite,
    auth: authBite,
  },
  authInitialState
);
