import { CONSTANT } from "src/common/utils/constant";
const amqplib = require("amqplib");

class RabbitMQService {
  private connect: any;
  private channels: any;
  constructor() {
    if (!this.connect) {
      this.init();
    }

    if (!this.channels) {
      this.channels = {};
    }
    if (!this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.RECEIVE]) {
      this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.RECEIVE] = {};
    }

    if (!this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.SEND]) {
      this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.SEND] = {};
    }
  }

  async initChannel(mode: string, queue: string) {
    if (!this.connect) {
      await this.init();
      throw new Error(CONSTANT.ERROR.E0005.message);
    }

    if (!this.channels[mode][queue]) {
      this.channels[mode][queue] = await this.connect.createChannel();
    }
  }

  async receive(queue: string) {
    await this.initChannel(CONSTANT.RABBITMQ.CHANNEL_TYPE.RECEIVE, queue);
    this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.RECEIVE][queue].assertQueue(
      queue
    );
    this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.RECEIVE][queue].consume(
      queue,
      (msg: any) => {
        if (msg !== null) {
          console.log(msg.content.toString());
          this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.RECEIVE][queue].ack(msg);
        }
      }
    );
  }

  async send(queue, data: any) {
    await this.initChannel(CONSTANT.RABBITMQ.CHANNEL_TYPE.SEND, queue);
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.SEND][queue].assertQueue(
      queue
    );
    this.channels[CONSTANT.RABBITMQ.CHANNEL_TYPE.SEND][queue].sendToQueue(
      queue,
      Buffer.from(data)
    );
  }

  async init() {
    try {
      const conn = await amqplib.connect(CONSTANT.RABBITMQ.CONNECTION_URL);
      this.connect = conn;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const rabbitMQIntance = new RabbitMQService();
