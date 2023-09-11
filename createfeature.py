""" Set up the folder sturcture for a new feature """
import os

def scaffold():
    dir_name  = input(">> add directory name: ")
    full_path = f"{os.getcwd()}{os.sep}src{os.sep}features{os.sep}{dir_name}"
    print(dir_name)
    print(full_path)


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
    
    with open(f"{interface}{os.sep}{dir_name}Interface.ts", "w") as f:
        f.write(interfaceFile(appName))
        f.close()

    with open(f"{controllers}{os.sep}{dir_name}Controller.ts", "w") as f:
        f.write(controllerFile(appName))
        f.close()

    with open(f"{schemas}{os.sep}{dir_name}Schema.ts", "w") as f:
        f.write(schemaFile(appName))
        f.close()

    with open(f"{routes}{os.sep}{dir_name}Routes.ts", "w") as f:
        f.write(routeFile(appName))
        f.close()





    
    # base_name = os.path.basename(path)


def interfaceFile(name): 
    return f""" 
    import {{ Document }} from 'mongoose';
    import {{ ObjectId }} from 'mongodb';

    export interface I{name.capitalize()}Document extends Document {{
            _id: string | ObjectId;
            name: string
    }}""" 


def controllerFile(name): 
    return f""" 
    import {{ Request, Response }} from 'express';
    import HTTP_STATUS from 'http-status-codes';
    import {{ __add_service__ }} from '../../../lib/services/db/{name}Service';


    export class {name.capitalize()}Controller {{

        public async read( req: Request, res: Response ): Promise<void> {{
            try{{
                const {name} = {name}Service.getById(req.params.id);
            }}catch(err){{
                console.log(err);
            }}
            
            res.status(HTTP_STATUS.OK).json( {{ {name} }} );
        }}

    }}"""


def routeFile(name):

    return f"""
    import express, {{Router}} from 'express';


    class {name.capitalize()}Routes {{
        private router: Router;
        constructor(){{
            //this.router = express.Router(routeHandler.prototype.action);
        }}
    }}

    export const authRoutes:AuthRoutes = new AuthRoutes();"""




def schemaFile(name):
    return f"""
    import {{ I{name.capitalize()}Document }} from '../interfaces/{name}Interface';
    import mongoose, {{ model, Model, Schema }} from 'mongoose';

    const {name}Schema: Schema = new Schema({{ 
    
        name: {{ type: String, index: true }},

    }});

    const {name.capitalize()}Model: Model<{name.capitalize()}Document> = model<I{name.capitalize()}Document>('{name.capitalize()}', {name}Schema, '{name.capitalize()}');
    export {name.capitalize()}{{Model}};
    """



if __name__ == "__main__":
    scaffold()