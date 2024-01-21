/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IState, ITriggers } from '../../_redux/types';
import { Compose } from './Compose';
import './ComposeGrid.less';
import { Reflexio } from '../../../../../packages/on-reflexio/lib/reflector';
import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import {store, system} from '../../_redux/index';


const paneltree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
const panelTags = new Tags(paneltree);
const ComposePanel = ({
  composeItems,
  onOpen,
  onDrop,
}: {
  composeItems: Array<{
    id: string;
    subject: string | null;
  }>;
  onOpen: (id: string) => void;
  onDrop: (id: string) => void;
}) =>
  panelTags.root(
    {
      attributes: {
        class: 'composeButtonGrid',
      },
      tagName: 'div',
      child: composeItems.map((ci, i) =>
        panelTags.div(
          {
            className: 'composeButtonGridButtonWrap',
            child: panelTags.button(
              {
                className: 'btn',
                onClick: () => onOpen(ci.id),
                child: panelTags.div(
                  {
                    className: 'btnText',
                    child: ci.subject || '(Без темы)',
                  },
                  `panel_div_${i}`
                ),
              },
              `panel_btn_${i}`
            ),
          },
          `panel_div_wrap_${i}`
        )
      ),
    },
    'compose_panel_root_key'
  );

const reflexio = new Reflexio<ITriggers, IState>(store, system);
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
const tags = new Tags(tree);
export const ComposeGrid = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => ({
      items: state.compose?.composeItems || [],
      opened: state.compose?.openedComposeId,
    }),
    ['setContent'],
    ComposeGrid
  );

  const result = tags.root({
    tagName: 'div',
    child: !state.opened
      ? ComposePanel({
          composeItems: state.items,
          onOpen: (id) => trigger('setContent', 'openWindow', { id }),
          onDrop: (id) => trigger('setContent', 'closeWindow', { id }),
        })
      : tags.tag({
          tagName: 'div',
          child: Compose(),
          attributes: {
            class: 'popupWrapper',
            //@ts-ignore
            'data-wrapper': true,
          },
          eventListeners: {
            click: (e) => {
              if (e.target.dataset.wrapper) {
                trigger('setContent', 'openWindow', { id: null });
              }
            },
          },
          // onClick: () => trigger('setContent', 'openWindow', { id: null }),
        }),
  });

  // if (!state.opened) {
  //   return tags.root({
  //     key: 'compose_grid_root_pan',
  //     child: ComposePanel({
  //       composeItems: state.items,
  //       onOpen: (id) => trigger('setContent', 'openWindow', { id }),
  //       onDrop: (id) => trigger('setContent', 'closeWindow', { id }),
  //     }),
  //   });
  // }

  // return tags.root({
  //   key: 'compose_grid_root_compose',
  //   child: state.opened ? Compose() : null,
  //   attributes: {
  //     class: 'popupWrapper',
  //   },
  //   eventListeners: {
  //     click: () => trigger('setContent', 'openWindow', { id: null }),
  //   },
  // });

  return result;
};
