

export interface IdefaultErrorRes {
    result: null;
    error: string;
}

export interface IdefaultSuccessRes {

}

export class Lang{

    static createOk(name:string) : string {
        return `${name} Created Successfully`;
    }

    static updateOk(name:string): string{
        return `${name} Updated Successfully`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static defaultSuccessRes(res:any) : IdefaultSuccessRes{
        return { result: res, error: null };
    }

    static defaultErrorRes(error:string) : IdefaultErrorRes {
        return { result: null, error: `${error}` };
    }


}
