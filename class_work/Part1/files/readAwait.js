// let read file with async await
import { promises as fsPromises } from 'fs';


console.log('start read file');

const fileName="./folder/index.html";

async function readfiles(){
      try{
         const fileData=await fsPromises.readFile(fileName,"utf8");
         console.log(fileData);
      }catch(err){
         console.log("Error: ",err);
      }
}

readfiles()