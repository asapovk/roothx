import { Html, HtmlFactory } from "./Html";
import { State } from "./State";


interface Opts {
    title: 'title',
    subtitle: 'subtitle'
}

const factory = new HtmlFactory<Opts>();
export const SmallComponent = (props: {
        key: string, 
        title: string,
        subtitle: string, 
        onClick: ()=> void
    })  => {
    const html = factory.getInstance(props.key);
    html.root({
        'key': props.key,
        'child': [
            html.div({
                'child': props.title,
                'key': 'title',
                style: {fontSize: '12px'},
                onClick: props.onClick  
            }),
            html.div({
                'child': props.subtitle,
                'key': 'subtitle',
                style: {fontSize: '10px'},
            }),
        ]
    })

    return html.render();   
}
