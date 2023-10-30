""" Set up the folder sturcture for a new feature """
import os

def scaffold():
    
    dir_name  = input(">> add app name: ")

    if  " " in dir_name:
        print( f"Removing Spaces from {dir_name}" ) 
        dir_name = dir_name.strip().replace(" ", "")

    full_path = f"{os.getcwd()}{os.sep}src{os.sep}features{os.sep}{dir_name}"
    interface = f"{full_path}{os.sep}interfaces"
    controllers = f"{full_path}{os.sep}controllers"
    models = f"{full_path}{os.sep}models"
    schemas = f"{full_path}{os.sep}schemas"
    routes = f"{full_path}{os.sep}routes"

    os.makedirs(full_path)
    os.makedirs(controllers)
    os.makedirs(interface)
    os.makedirs(models)
    os.makedirs(schemas)
    os.makedirs(routes)

    appName = dir_name if dir_name.endswith('s') else dir_name.rstrip('s')    
    print( f"""Adding {appName} files to: {full_path} """ )

    with open(f"{interface}{os.sep}{dir_name}Interface.ts", "w") as f:
        f.write(interfaceFile(appName))
        f.close()

    with open(f"{controllers}{os.sep}{dir_name}Controller.ts", "w") as f:
        f.write(controllerFile(appName))
        f.close()

    with open(f"{models}{os.sep}{dir_name}Model.ts", "w") as f:
        f.write(modelFile(appName))
        f.close()

    with open(f"{schemas}{os.sep}{dir_name}Schema.ts", "w") as f:
        f.write(schemaFile(appName))
        f.close()

    with open(f"{routes}{os.sep}{dir_name}Routes.ts", "w") as f:
        f.write(routeFile(appName))
        f.close()

    print('Done :) ')


def interfaceFile(name): 
    return f""" 
    import {{ Document }} from 'mongoose';
    import {{ ObjectId }} from 'mongodb';

    export interface I{name.capitalize()}Document extends Document {{
            _id: string | ObjectId;
            userId: string | ObjectId;
            name: string;
            createdAt?: Date;
            updatedAt?: Date;
            
    }}""" 


def controllerFile(name): 
    return f""" 
    import {{ Request, Response }} from 'express';
    import HTTP_STATUS from 'http-status-codes';
    import {{ {name}Service }} from '../../../lib/services/db/{name}Service'; // you need to create this 
    import {{ Lang }} from '../../../lib/utils/lang';

    /**
    * Return A {name.capitalize()} By ID
    * @method get
    * @param req Request body
    * @param res Response body
    * @returns json
    */
    export class {name.capitalize()}Controller {{
        public async read( req: Request, res: Response ): Promise<void> {{
            try{{
                const result = {name}Service.get{name}ById(req.params.id);
                res.status(HTTP_STATUS.OK).json( Lang.defaultSuccessRes(result) );
            }}catch(err){{
                console.log(err);
                res.status(HTTP_STATUS.BAD_REQUEST).json(  Lang.defaultErrorRes(`${{err}}`) );
            }}
        }}
    }}"""


def routeFile(name):
    return f"""
    import express, {{Router}} from 'express';
    import {{ {name.capitalize()}Controller }} from '../controllers/{name}Controller';

    class {name.capitalize()}Routes {{

        private router: Router;
        private authRouter: Router;

        //init public and private routes
        constructor(){{
            // public endpoints
            this.router = express.Router();
            // private endpoints
            this.authRouter = express.Router();
        }}

        //public routes
        public routes():Router {{
            this.router.get('/{name}/index', {name.capitalize()}Controller.prototype.read );
            return this.router;
        }}

        //private routes
        public authRoutes() : Router {{
            //this.authRouter.post('/{name}', {name.capitalize()}Controller.prototype.create );
            return this.authRouter;
        }}
    }}

    export const {name}Routes:{name.capitalize()}Routes = new {name.capitalize()}Routes();
    """

def modelFile(name): 
    return f""" 
    import {{ model, Model }} from 'mongoose';
    import {{ I{name.capitalize()}Document }} from '../interfaces/{name}Interface';
    import {{ {name.capitalize()}Schema }} from '../schemas/{name}Schema';

    const {name.capitalize()}Model: Model<I{name.capitalize()}Document> = model<I{name.capitalize()}Document>('{name.capitalize()}', {name.capitalize()}Schema, '{name.capitalize()}');
    export {{ {name.capitalize()}Model }};"""

def schemaFile(name):
    return f"""
    import mongoose, {{ Schema }} from 'mongoose';
    export const {name.capitalize()}Schema: Schema = new Schema({{
        userId: {{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }},
        name: {{ type: String, default: '' }},
        updatedAt: {{ type: String, default: Date.now() }},
        createdAt: {{ type: Date, default: Date.now() }}
    }});"""

if __name__ == "__main__":
    scaffold()