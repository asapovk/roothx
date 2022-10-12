import { Html } from "./Html";
import { SmallComponent } from "./SmallComponent";
import { State } from "./State";

interface Opts {   
    root:  'key'
    displayInput: 'displayInput'
    click: 'CLICK',
    key_child_2: 'key_child_2'
    input: 'input'
}  


const html = new Html<Opts>();//here insert context and opts
const ac = new State<Array<string>>();//think how to share in between components
const is = new State<string>();
// implement new Controller which's instance can controll component from outside
export const Component = (props?: any)  => {
    const { state, setState } = ac.useState([], Component)
    const { state: inputValue, setState: setInputValue } = is.useState('initialInput', Component)
    const deleteSmall = (index: number) => {
        const newState = [...state]
        newState.splice(index, 1)
        setState(newState)
    }
    html.root({
        'key': 'root',
        'child': [
            ...state.map((d, index) => SmallComponent({key: d, 
                title: `Head ${d}`,
                subtitle:`${d}`,
                onClick: () => deleteSmall(index) 
                })),
            html.div({
                'child': 'CLICK',
                'key': 'key_child_2',
                style: 'color: green;',
                onClick: () => {
                    setState([...state, `${state.length+1}`]);
                }
            }),
            html.div({
                key: 'displayInput',
                child: inputValue
            }), 
            html.input({
                key: 'input',
                onChange: (e: any) => {setInputValue(e.target.value)},
                value: inputValue,
            }) 
        ]
    })

    return html.render();   
}


