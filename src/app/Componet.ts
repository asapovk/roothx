import { Keep } from "../_calc-root/Controller";
import { Html } from "../_calc-root/Html";
import { Modal } from "./Modal";
import { SmallComponent } from "./SmallComponent";
import { State } from "../_calc-root/State";

interface Opts {   
    root:  'key'
    displayInput: 'displayInput'
    click: 'CLICK',
    key_child_2: 'key_child_2'
    input: 'input',
    key_child_3: 'key_child_3'
}  


const html = new Html<Opts>();//here insert context and opts
const ac = new State<Array<string>>();//think how to share in between components
const modalState = new State<boolean>();//think how to share in between components
const is = new State<string>();
const c = new Keep<Logic>();

class Logic {
    public node: HTMLElement;
    private state: any 
    public passState (state) {
        this.state = state
    }
    public go() {
        console.log(`go ${this.state}`)
    }
}   


// implement new Controller which's instance can controll component from outside
export const Component = (props?: any)  => {
    const { state, setState } = ac.useState([], Component)
    const { state: modalOpen, setState: setModalOpen } = modalState.useState(false, Component)
    const { state: inputValue, setState: setInputValue } = is.useState('initialInput', Component)
    const api = c.useController(() => new Logic(), (c) => c.passState(state))
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
                style: {color: 'green'},
                onClick: () => {
                    setState([...state, `${state.length+1}`]);
                }
            }),
            html.div({
                'child': 'OPEN MODAL',
                'key': 'key_child_3',
                style: {color: 'blue'},
                onClick: () => {
                    setModalOpen(true);
                }
            }),
            html.div({
                key: 'displayInput',
                child: inputValue,
                getNode: (n) =>  {api.node = n}
            }), 
            html.input({
                key: 'input',
                onChange: (e: any) => {setInputValue(e.target.value)},
                value: inputValue,
            }),
            Modal(modalOpen, ()=> setModalOpen(false)) 
        ]
    })

    return html.render();   
}


