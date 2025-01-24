import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Kafka, Producer, ProducerRecord } from "kafkajs";
// import { IProducer } from './producer.interface';

@Injectable()
export class ProducerService implements OnApplicationShutdown {

    // private readonly producers = new Map<string, IProducer>();
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
    })

    private readonly producer: Producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
    }

    async produce(record: ProducerRecord) {
        await this.producer.send(record);
    }

    async onApplicationShutdown() {
        await this.producer.disconnect();
        // throw new Error("Method not implemented.");
    }

}