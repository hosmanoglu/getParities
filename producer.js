const {
  KAFKA_HOST: host,
  PORT: port,
  MECHANISM: mechanism,
  KAFKA_USERNAME: username,
  KAFKA_PASSWORD: password,
} = process.env;

const clientOptions = {
  kafkaHost: `${host ?? "localhost"}:${port ?? 9092}`,
  ...(username ? { mechanism, username, password } : {}),
};

const { TOPICS } = require("./enums");

const kafka = require("kafka-node"),
  HighLevelProducer = kafka.HighLevelProducer,
  client = new kafka.KafkaClient(clientOptions),
  producer = new HighLevelProducer(client);

let topicReady = 0;
producer.on("ready", function () {
  producer.createTopics(
    Object.values(TOPICS),
    false,
    async function (err, data) {
      if (err) {
        console.log("topic not created");
        console.log(err);
        return;
      }
      topicReady = 1;
    }
  );
});

function sendKafka(payloads) {
  return new Promise((resolve, reject) => {
    if (!topicReady) {
      reject("topic not ready");
      return
    }
    producer.send(payloads, function (err, data) {
      resolve(data);
    });
  });
}
module.exports = { sendKafka };
