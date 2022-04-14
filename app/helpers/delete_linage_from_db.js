import Response from "../models/response";

const deleteLinageFromDB = async (linage = {}) => {
    console.log("ARRAY OF IDS")
    console.log(linage);
    let result = await Response.destroy({
        where: {
            childResponseTrigger: linage
          },
      });

      console.log("ITEMS TO BE REMOVED")
      console.log(result);
    return result;
};

export default deleteLinageFromDB;
