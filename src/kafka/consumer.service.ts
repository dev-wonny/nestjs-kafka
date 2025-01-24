import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { ConsumerConfig, ConsumerSubscribeTopic, KafkaMessage, Kafka, Consumer, ConsumerSubscribeTopics, ConsumerRunConfig } from "kafkajs";

interface KafkajsConsumerOptions {
    topic: ConsumerSubscribeTopic;
    config: ConsumerConfig;
    onMessage: (message: KafkaMessage) => Promise<void>;
}

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
    })

    private readonly consumers: Consumer[] = [];

    async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        const consumer = this.kafka.consumer({
            groupId: 'nestjs-kafka'
        });

        await consumer.connect();
        await consumer.subscribe(topic);
        await consumer.run(config);

        this.consumers.push(consumer);
    }

    // async consume2({ topic, config, onMessage }: KafkajsConsumerOptions) {
    //     const consumer = new KafkajsConsumer(
    //         topic,
    //         this.databaserService,
    //         config,
    //         this.configService.get('KAFKA_BROKER'),
    //     );
    //     await consumer.connect();
    //     await consumer.consume(onMessage);
    //     this.consumers.push(consumer);
    // }

    async onApplicationShutdown() {
        for (const c of this.consumers) {
            await c.disconnect();
        }
    }

}