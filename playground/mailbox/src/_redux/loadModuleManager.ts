export interface HotModule {
    name: string;
    source: string;
}



export class LoadModuleManager {

    //private modules: Array<HotModule> = [];

    public loadScript = (source: string): Promise<HTMLScriptElement> =>
    new Promise<HTMLScriptElement>((resolve, reject) => {
      const script = document.createElement('script');

      script.src = source;
      script.async = true;

      script.onload = () => {
        resolve(script);
      };

      script.onerror = () => {
        reject(new Error(`script not loaded: ${source}`));
      };

      document.body.appendChild(script);
    });
}