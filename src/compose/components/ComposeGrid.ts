import { IState } from '../../_redux/types';
import { Compose } from './Compose';
import './ComposeGrid.less';
import { Reflexio } from '../../root-redux/reflector';
import { Tree } from '../../root/NTree';
import { Tags } from '../../root/Tags';

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
  panelTags.root({
    key: 'compose_panel_root_key',
    attributes: {
      class: 'composeButtonGrid',
    },
    child: composeItems.map((ci, i) =>
      panelTags.div(`panel_div_wrap_${i}`, {
        className: 'composeButtonGridButtonWrap',
        child: panelTags.button(`panel_btn_${i}`, {
          className: 'btn',
          onClick: () => onOpen(ci.id),
          child: panelTags.div(`panel_div_${i}`, {
            className: 'btnText',
            child: ci.subject || '(Без темы)',
          }),
        }),
      })
    ),
  });

const reflexio = new Reflexio<{
  items: Array<any>;
  opened: string | null;
}>();
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
const tags = new Tags(tree);
export const ComposeGrid = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => ({
      items: state.compose.composeItems,
      opened: state.compose.openedComposeId,
    }),
    ComposeGrid
  );

  return tags.root({
    key: 'ComposeGrid_root',
    child: !state.opened
      ? ComposePanel({
          composeItems: state.items,
          onOpen: (id) => trigger('setContent', 'openWindow', { id }),
          onDrop: (id) => trigger('setContent', 'closeWindow', { id }),
        })
      : tags.div('compose_grid_root_compose', {
          child: Compose(),
          className: 'popupWrapper',
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
};
