# for run
npm i 
npm run start

### install kafka to local docker
docker compose up -d

docker compose exec broker  kafka-topics --create   --bootstrap-server localhost:9092  --replication-factor 1  --partitions 1

