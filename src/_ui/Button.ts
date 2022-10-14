import { Tree } from "../_calc-root/Tree"

interface ButtonOpts {
    key: string
    text: string
    onClick: () => void
    color: string
    size?: 'm' | 'l' | 's' | 'xl' | 'xs',
    mt?: string
    mb?: string
    ml?: string
    mr?: string
    
}


export const Button = <T>(tree: Tree<T>, opts: ButtonOpts) => {
    tree.div({
        'key': opts.key as any,
        'child': opts.text,
        onClick: opts.onClick
    })
}