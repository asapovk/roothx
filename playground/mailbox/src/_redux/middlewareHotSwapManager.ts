import { Middleware } from "redux";

export class MiddlewareHotSwapManager {
    private middlewares: Array<Middleware> = []; 

    public addMiddleware(mv: Middleware) {
        this.middlewares.push(mv)
    }

    public cumulativeMiddleWare = (store) => (next) => (action) => {
        for(let mv of this.middlewares) {
            return mv(store)(next)(action)
        }
        if(!this.middlewares.length) {
            return next(action)
        }
        
    }
}