const axios = require("axios");
const xml2js = require("xml2js");

async function fetchParities() {
  try {
    const response = await axios.get(
      "https://www.tcmb.gov.tr/kurlar/today.xml"
    );

    let publish = [];
    const jsonParities = await xml2js.parseStringPromise(response.data);

    publish = jsonParities?.["Tarih_Date"]?.Currency.map((x) => {
      return {
        value: x.ForexBuying[0],
        Name: x?.$?.Kod + "TRY",
      };
    });

    return publish;
  } catch (error) {
    console.log(error);
  }

  //JSON formati : [  {Name: "USDTRY" , value : "11111" } ,  {Name: "EUTRY" , value : "2222" }]
}

module.exports = { fetchParities };
