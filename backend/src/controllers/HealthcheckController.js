export const healthcheck = async (req, res) => {
    // try{
        res.status(200).json({status: "OK", success: true});
/*    }catch(err){
        console.log(err);
        res.json({status: "ERROR",success: false});
    }*/
}