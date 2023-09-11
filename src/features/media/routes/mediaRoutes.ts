
    import express, {Router} from 'express';


    class MediaRoutes {
        private router: Router;
        constructor(){
            this.router = express.Router();
        }

        public uploadRoutes() : Router {


            return this.router;
        }


    }

    export const mediaRoutes:MediaRoutes = new MediaRoutes();
