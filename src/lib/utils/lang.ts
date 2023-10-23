

export interface IdefaultErrorRes {
    result: null;
    error: string;
}

export class Lang{

    static createOk(name:string) : string {
        return `${name} Created Successfully`;
    }

    static updateOk(name:string): string{
        return `${name} Updated Successfully`;
    }

    static defaultErrorRes(error:string) : IdefaultErrorRes {
        return { result: null, error: `${error}` };
    }


}
