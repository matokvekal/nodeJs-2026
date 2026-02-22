

 const createBitcoin = async (req, res) => {
    let data = req.body;
    console.log(data);
    if(data?.name){
        res.send(JSON.stringify(`${data?.name} Thanks for sending Form`));
    }else{
        res.redirect("/");
    }
    }

 export const createRipple = async (req, res) => {
    let data = req.body;
    console.log(data);
    if(data?.name){
        res.send(JSON.stringify(`${data?.name} Thanks for sending Form`));
    }else{
        res.redirect("/");
    }
    }

    const createMonroe = async (req, res) => {

        let data = req.body;
    }


export default createBitcoin;


//import mybit from "./server7/bitcoin.js";
import createRipple from "./server7/bitcoin.js";
