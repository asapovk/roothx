/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IState, ITriggers } from '../../_redux/types';
import './Compose.less';
import { Reflexio } from '../../../../../packages/on-reflexio/lib/reflector';
import { Element, Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import {store, system} from '../../_redux/index';

const reflexio = new Reflexio<ITriggers, IState>(store, system);
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
//@ds-replace
const tags = new Tags(tree);
export const Compose = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => ({
      subject: state.compose?.subject,
      body: state.compose?.body,
      to: state.compose?.to,
    }),
    ['setContent']
    //Compose
  );

  const { subject, body, to } = state;

  return tags.root({
    onMount: () => {
      trigger('openPopup', 'init', {
        message: 'Вы уверены ?',
        yesCb: () => trigger('preventClose', 'clear', null),
        noCb: () => trigger('openPopup', 'close', null),
        cancelCb: () => console.log('cancel'),
      });
      console.log('mountCompose');
      //@ts-ignore
      tinymce.init({
        mode: 'exact',
        selector: '#editor_target',
      });
    },
    onUnmount() {
      console.log('UNmountCompose');
      //@ts-ignore
      tinymce.activeEditor.remove({
        selector: '#editor_target',
      });
      //@ts-ignore
    },
    tagName: 'div',
    attributes: {
      class: 'popupwindow',
    },
    child: [
      tags.div({
        className: 'root',
        child: [
          tags.div({
            className: 'composeWrap',
            child: [
              tags.div({
                className: 'subject',
                child: tags.textInput({
                  className: 'textInput',
                  value: state.subject,
                  onChange: (e) =>
                    trigger('setContent', 'syncForm', {
                      input: 'subject',
                      text: e.target.value,
                    }),
                }),
              }),
              tags.textArea({
                className: 'body',
                id: 'editor_target',
                value: state.body,
                onChange: (e) =>
                  trigger('setContent', 'syncForm', {
                    input: 'body',
                    text: e.target.value,
                  }),
              }),
            ],
          }),
          tags.div({
            className: 'composeButtonsGroup',
            child: [
              tags.button({
                child: 'Submit',
                className: 'composeButtonsGroupItm',
                onClick: () => trigger('submitLetter', 'init', null),
              }),
              tags.button({
                child: 'Close',
                className: 'composeButtonsGroupItm',
                onClick: () => {
                  trigger('setContent', 'closeWindow', null);
                },
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
