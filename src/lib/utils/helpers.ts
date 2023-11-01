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
        return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)], '');
    }


    static randomIntHash(len=23) : string {
        const p = '0123456789';
        return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)], '');
    }


    static addHoursToDate(hours = 1) : Date {
        const date = new Date();
        date.setHours(date.getHours() + hours);
        return date;
    }

    static slugify(str:string) : string {
       return str.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static upsertArrayById(id: string, val:unknown, arr:Array<unknown|any>) : Array<unknown> {
        const temp = arr;
        arr.map((item, idx) => {
            if(`${item['id']}` === `${id}`){
                temp[idx] = val;
            }
        });
        return temp;
    }

    static insertIntoArray(idx: number, val:unknown, arr:Array<unknown>) : Array<unknown> {
            arr.splice(idx, 1, val);
            return arr;
    }

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getArrayIndex( arr:Array<any>, key:string, val:unknown ) : number {
        const temp = arr;
        return temp.map(e => e?.[`${key}`] ).indexOf(val);

    }



}


/**
 *
 * const list = ['foo', 'bar', 'baz'] as const;
    type StringIndices = Exclude<keyof (typeof list), keyof []>; // = "0" | "1" | "2"
    type Indices<T extends readonly any[]> = Exclude<Partial<T>["length"], T["length"]>
    type Test = Indices<typeof list> // = 0 | 1 | 2
 *
 */
