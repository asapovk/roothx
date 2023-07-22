export interface StyleOpts {
  color?: string;
  fontSize?: string;
  backgroundColor?: string;
  border?: string;
  position?: string;
  display?: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  height?: string;
  width?: string;
  margin?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  padding?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  zIndex?: string;
}

export class Style {
  private transformPropName = (ksopt: keyof StyleOpts) => {
    switch (ksopt) {
      case 'backgroundColor':
        return 'background-color';
      case 'fontSize':
        return 'font-size';
      case 'zIndex':
        return 'z-Index';
      case 'marginTop':
        return 'margin-top';
      case 'marginBottom':
        return 'margin-bottom';
      case 'marginLeft':
        return 'margin-left';
      case 'marginRight':
        return 'margin-right';
      case 'paddingTop':
        return 'padding-top';
      case 'paddingBottom':
        return 'padding-bottom';
      case 'paddingLeft':
        return 'padding-left';
      case 'paddingRight':
        return 'padding-right';
      default:
        return ksopt;
    }
  };
  public makeStyle(sopt: StyleOpts & Record<string, unknown>) {
    let data: string = '';
    for (const s in sopt) {
      data += `${this.transformPropName(s as any)}: ${sopt[s]};\n`;
    }

    return data;
  }
}
