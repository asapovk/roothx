/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ScriptInitArgsType,
  ScriptOptsType,
  ScriptUpdateArgsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IState, ITriggers } from '../../_redux/types';
import { IComposeTriggers } from '../compose.config';

export class SubmitLetterScript {
  constructor(
    private opts: ScriptOptsType<
      IComposeTriggers,
      ITriggers,
      IState,
      'submitLetter'
    >
  ) {}

  public async init(
    args: ScriptInitArgsType<IComposeTriggers, 'submitLetter', 'init'>
  ) {
    const { openedComposeId } = this.opts.getCurrentState().compose;
    // save
    this.opts.trigger('setContent', 'commitFormContent', null); // сохранили данные из локал  в стейт
    const { subject, body } = this.opts.getCurrentState().compose; // читаем стейт
    this.opts.trigger('setContent', 'syncForm', {
      text: subject,
      input: 'subject',
    });
    this.opts.trigger('setContent', 'syncForm', {
      text: body,
      input: 'body',
    });
    //First we need to validate form;
    const valRes = await this.opts.hook(
      'setContent',
      'validateForm',
      'throwValidationResult',
      {
        id: openedComposeId,
      }
    );
    if (valRes.error) {
      this.opts.trigger('showNotification', 'init', {
        type: 'error',
        message: valRes.error,
      });

      return;
    }
    // start
    this.opts.trigger('saveLetter', 'init', {
      body: body,
      subject: subject,
      from: 'asapovk@gmail.com',
      to: '',
      uid: 123,
    }); // запускаем скрипт сохранения
    const savedId = await this.opts.wait('saveLetter', 'done');
    //Here we can throw notification that savedId was just created. For example
    this.opts.trigger('setContent', 'closeWindow', {
      id: openedComposeId,
      noCheck: true,
    }); // дропаем окно
    this.opts.trigger('showNotification', 'init', {
      message: 'Letter is saved',
      type: 'success',
    }); // кидаем нотификейшн
    // kill instance
    this.opts.drop(); // убиваем инстанс
  }

  public update(
    args: ScriptUpdateArgsType<
      IComposeTriggers,
      'submitLetter',
      'init' | 'done' | 'save'
    >
  ) {}
}
