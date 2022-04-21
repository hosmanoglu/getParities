const { fetchParities } = require("./fetchParities");
const { sendKafka } = require("./producer");
const { TOPICS } = require("./enums");
const { timeout } = require("./utils");
const { consumer } = require("./consumer");

let parities = null;

async function main() {
  try {
    parities = parities ?? (await fetchParities());

    await sendKafka([
      {
        topic: TOPICS.PARITIES,
        messages: parities.map((x) => JSON.stringify(x)),
      },
    ]);
  } catch (error) {
    console.log(error);
    if (error === "topic not ready") {
      await timeout(5000);
      main();
    }
  }
}
main();
