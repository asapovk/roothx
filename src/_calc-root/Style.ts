

export interface StyleOpts {
    color?: string
    fontSize?: string
    backgroundColor?: string
    border?: string
    position?: string
    display?: string
    top?: string
    bottom?: string
    left?: string
    right?: string
    height?: string
    width?: string
    margin?: string
    padding?: string
    zIndex?: string 

}

export class Style {
    private transformPropName = (ksopt: keyof StyleOpts ) => {
        switch (ksopt) {
            case 'backgroundColor':
                return 'background-color'
            case 'fontSize': 
                return 'font-size'
            case 'zIndex': 
                return 'z-Index'
            default:
                return ksopt
        }
    }
    public makeStyle(sopt: StyleOpts) {
        let data: string = '';
        for (let s in sopt) {
            data += `${this.transformPropName(s as any)}: ${sopt[s]};\n`
        }
        return data
    } 
}