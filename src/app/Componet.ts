import { Keep } from "../_calc-root/Controller";
import { Tree } from "../_calc-root/Tree";
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


const tree = new Tree<Opts>();//here insert context and opts
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

    tree.root({
        'key': 'root',
        'child': [
            ...state.map((d, index) => SmallComponent({key: d, 
                title: `Head ${d}`,
                subtitle:`${d}`,
                onClick: () => deleteSmall(index) 
                })),
            tree.div({
                'child': 'CLICK',
                'key': 'key_child_2',
                style: {color: 'green'},
                onClick: () => {
                    setState([...state, `${state.length+1}`]);
                }
            }),
            tree.div({
                'child': 'OPEN MODAL',
                'key': 'key_child_3',
                style: {color: 'blue'},
                onClick: () => {
                    setModalOpen(true);
                }
            }),
            tree.div({
                key: 'displayInput',
                child: inputValue,
                getNode: (n) =>  {api.node = n}
            }), 
            tree.input({
                key: 'input',
                onChange: (e: any) => {setInputValue(e.target.value)},
                value: inputValue,
            }),
            Modal(modalOpen, ()=> setModalOpen(false)) 
        ]
    })

    return tree.calc();   
}


