import { Tree } from "../_calc-root/Tree"

interface Keys {
    background: 'background',
    window: 'window',
    innerFrame: 'innerFrame'
}


const tree = new Tree<Keys>()
export const Modal = (show: boolean, onClick: ()=> void) => {
    // синхронизировать state callbac  
    tree.root({ //добавть controller - unmount(), update(), node,
        'key': 'modal',
        'child': [
            tree.div({
                if: show,
                onClick,
                'key': 'background',
                'child': '',
                'style': {
                    top: '0',
                    left: '0',
                    'position': 'absolute',
                    'height': '100vh',
                    'width': '100%',
                    zIndex: '9',
                    backgroundColor: 'rgba(41, 46, 45, 0.6)'
                }
            }),
            tree.div({
                if:show,
                'key': 'innerFrame',
                'style': {
                    position: 'fixed',
                    width: '100px',
                    height: '100px',
                    margin: 'auto',
                    top: '100px',
                    backgroundColor: 'green',
                    zIndex: '10'
                },
                child: 'Hello world'
            })
        ]
    })
    return tree.calc()
}