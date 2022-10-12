



export class State {

    static instance: State


    private state: number;
    private contextFunction: Function;

    private setState = (value: number) => {
        this.state = value
        this.contextFunction()
    }
    private isMounted: boolean
    public useState(initialState: number, context: Function) {
        if(!this.isMounted) {
            this.isMounted = true
            this.state = initialState
            this.contextFunction = context
        }
        console.log(this.isMounted)
        return {
           state:this.state,
           setState: this.setState
        }
    } 

    static getInstance(): State {
        if(!this.instance) {
            console.log('ne instance')
            return new State()
        }
        return this.instance
    }


}

export const Sei = State.getInstance()

export function Root(element: HTMLElement): void {
    const rootElement = document.getElementById('app');
    if(rootElement) {
        rootElement.appendChild(element)
    }
}

export function Div(element: HTMLElement | string, key: string,  onClick: (event)=> void,):HTMLElement  {
    const foundElement = document.getElementById(key);
    if(foundElement) {
        const parent = foundElement.parentElement;
        const el = createElementWithKey(element, key)
        el.addEventListener('click', onClick)
        parent.replaceChildren(el)
        
    }
    const divElement =  document.createElement('div');
    divElement.setAttribute('id', key);
    if(typeof element === 'string') {
        console.log(`text content ${element}`)
        divElement.innerText = element
    }
    else {
        divElement.appendChild(element);
    }
    if(onClick) {
        divElement.addEventListener('click', onClick)   
    }
    return divElement
   
}

function createElementWithKey(element: HTMLElement | string, key: string) {
    const divElement =  document.createElement('div');
    divElement.setAttribute('id', key);
    if(typeof element === 'string') {
        console.log(`text content ${element}`)
        divElement.innerText = element
    }
    else {
        divElement.appendChild(element);
    }
    return divElement
} 


/*
div('text')

root(element) - монтирует element к корню

div(text) - возвращает элемент 

div(element) => создает родитель и монтирует дочерний к себе
возвращает родитель
*/