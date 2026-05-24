import app from "./app";
import config from "./config";
import { initDB } from "./db";


const main = async ()=>{
    try{
        await initDB();
        app.listen(config.port,()=>{
            console.log(`Listening at port ${config.port}`);
        })
    }
    catch(err : any){
        console.log(err);
    }
}

main();