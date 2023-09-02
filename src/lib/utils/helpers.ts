export class Helpers{

    static capLetters(val:string):string{
        return val.toLowerCase().split(' ').map((v:string)=>`${v.charAt(0).toUpperCase()}${v.slice(1).toLowerCase()}`).join(' ');
    }


    static parseJson(data: string): unknown | null {

        try{
            return JSON.parse(data);
        }catch(err){
            console.log(err);
            return null;
        }
    }


    static has(obj:object, prop:string){
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }


}
