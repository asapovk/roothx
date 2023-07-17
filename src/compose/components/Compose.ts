import { IState } from '../../_redux/types';
import './Compose.less';
import { Reflexio } from '../../root-redux/reflector';
import { Element, Tree } from '../../root/NTree';
import { Tags } from '../../root/Tags';

const reflexio = new Reflexio<{
  subject: string;
  body: string;
  to: string;
}>();
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
//@ds-replace
const tags = new Tags(tree);
export const Compose = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => ({
      subject: state.compose.subject,
      body: state.compose.body,
      to: state.compose.to,
    }),
    Compose
  );

  const { subject, body, to } = state;

  return tags.root(
    {
      onMount: () => {
        trigger('openPopup', 'init', {
          message: 'Вы уверены ?',
          yesCb: () => trigger('preventClose', 'clear', null),
          noCb: () => trigger('openPopup', 'close', null),
          cancelCb: () => console.log('cancel'),
        });
      },
      tagName: 'div',
      attributes: {
        class: 'popupwindow',
      },
      child: [
        tags.div(
          {
            className: 'root',
            child: [
              tags.div(
                {
                  className: 'composeWrap',
                  child: [
                    tags.div(
                      {
                        className: 'subject',
                        child: tags.textInput(
                          {
                            className: 'textInput',
                            value: state.subject,
                            onChange: (e) =>
                              trigger('setContent', 'syncForm', {
                                input: 'subject',
                                text: e.target.value,
                              }),
                          },
                          'subject_input_key'
                        ),
                      },
                      'subject_div_key'
                    ),
                    tags.textArea(
                      {
                        className: 'body',
                        value: state.body,
                        onChange: (e) =>
                          trigger('setContent', 'syncForm', {
                            input: 'body',
                            text: e.target.value,
                          }),
                      },
                      'body_area_key'
                    ),
                  ],
                },
                'compose_wrap_key'
              ),
              tags.div(
                {
                  className: 'composeButtonsGroup',
                  child: [
                    tags.button(
                      {
                        child: 'Сохранить',
                        className: 'composeButtonsGroupItm',
                        onClick: () => trigger('submitLetter', 'init', null),
                      },
                      'submit_letter_btn_key'
                    ),
                    tags.button(
                      {
                        child: 'Закрыть',
                        className: 'composeButtonsGroupItm',
                        onClick: () =>
                          trigger('setContent', 'closeWindow', null),
                      },
                      'close_btn_key'
                    ),
                  ],
                },
                'button_group_key'
              ),
            ],
          },
          'compose_roots_key'
        ),
      ],
    },
    'compose_key_rootss'
  );
};
