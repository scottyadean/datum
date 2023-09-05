export class Helpers{

    static capLetters(val:string) : string {
        return val.toLowerCase().split(' ').map((v:string)=>`${v.charAt(0).toUpperCase()}${v.slice(1).toLowerCase()}`).join(' ');
    }


    static parseJson(data: string) : unknown | null {

        try{
            return JSON.parse(data);
        }catch(err){
            console.log(err);
            return null;
        }
    }


    static has(obj:object, prop:string) : boolean {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }


    static randomHash(len=23) : string {
        const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
    }


    static addHoursToDate(hours = 1) : Date {
        const date = new Date();
        date.setHours(date.getHours() + hours);
        return date;
    }

}
