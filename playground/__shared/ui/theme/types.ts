export type ISize = 'm' | 'l' | 'xl' | 's' | 'xs';
export type IButtonColor =
  | 'primary'
  | 'secondary'
  | 'grey'
  | 'warning'
  | 'success'
  | 'error'
  | 'on-background';

export type ITextColor =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'error'
  | 'on-primary'
  | 'on-secondary'
  | 'on-background-plain'
  | 'on-background-strong'
  | 'on-background-mute'
  | 'on-panel';

export type ITextMode = 'plain' | 'strong' | 'mute';

export type IBlockColor =
  | 'primary'
  | 'secondary'
  | 'background'
  | 'panel'
  | 'transparent';

export type IButtonDecoration = 'normal' | 'outline' | 'text';

export interface IPadding {
  p?: string;
  pl?: string;
  pr?: string;
  pt?: string;
  pb?: string;
}

export interface IMargin {
  m?: string;
  ml?: string;
  mr?: string;
  mt?: string;
  mb?: string;
}
