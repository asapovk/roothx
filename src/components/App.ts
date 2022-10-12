import { Div } from "../Sei"
import { Sei } from "../Sei";




export const App = (props?: any) => {
    
    const {state, setState} = Sei.useState(10, App);
    
    console.log(`render ${state}`)

    const handleClick = () => {
        setState(state + 1);
    }

    return Div(`${state}`,'key', handleClick);
}