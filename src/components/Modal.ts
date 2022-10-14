import { Html } from "./Html"

interface Keys {
    background: 'background',
    window: 'window'
}


const html = new Html<Keys>()
export const Modal = (show: boolean, onClick: ()=> void) => {
    // синхронизировать state callbac  
    html.root({ //добавть controller - unmount(), update(), node,
        'key': 'modal',
        'child': [
            html.div({
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
                    backgroundColor: 'rgba(41, 46, 45, 0.6)'
                }
            })
        ]
    })
    return html.render()
}