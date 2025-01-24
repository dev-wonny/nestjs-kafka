import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./kafka/consumer.service";

@Injectable()
export class TestConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService) { }

    // KafkaJS의 버전에 따라 타입 정의가 다를 수 있으니, 사용하는 KafkaJS 버전에 맞는 타입을 확인하세요.

    async onModuleInit() {
        await this.consumerService.consume(
            // KafkaJS의 subscribe 메서드는 `topics` 배열을 요구

            // { topic: 'test' },// 여기 해결좀
            { topics: ['test'], fromBeginning: true }, // `topics` 배열로 전달

            {
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({
                        value: message.value ? message.value.toString() : null, // value가 null인지 확인 후 처리
                        topic: topic,
                        partition: partition.toString(), // partition은 number 타입, toString 호출 가능
                    });
                },
            },
        );// await end
    }// end
}