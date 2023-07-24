/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ScriptUpdateArgsType,
  ScriptInitArgsType,
  ScriptOptsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IState, ITriggers } from '../../_redux/types';
import { useSystem } from '@reflexio/reflexio-on-redux/lib';
import { IFolder, IFoldersTriggers } from '../interfaces/Folder.interface';

export class MakeNewFolderScript {
  constructor(
    private opts: ScriptOptsType<
      IFoldersTriggers,
      ITriggers,
      IState,
      'makeNewFolder'
    >
  ) {}

  private value: string;

  public async init(
    args: ScriptInitArgsType<IFoldersTriggers, 'makeNewFolder', 'init'>
  ) {}

  public async update(
    args: ScriptUpdateArgsType<
      IFoldersTriggers,
      'makeNewFolder',
      'submitForm' | 'typeValue'
    >
  ) {
    if (args.status === 'submitForm') {
      if (!this.value) {
        this.opts.trigger('showNotification', 'init', {
          message: 'Fill in folder name',
          type: 'error',
        });
      } else {
        this.opts.trigger('dialog', 'closeDialog', null);
      }
    }
    if (args.status === 'typeValue') {
      this.value = args.payload.value;
    }
  }
}
