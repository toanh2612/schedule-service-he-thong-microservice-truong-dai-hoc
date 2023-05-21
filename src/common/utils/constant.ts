export const CONSTANT = {
  ERROR: {
    E0000: {
      code: "E0000",
      httpStatusCode: 500,
      message: "General error",
    },
    E0001: {
      code: "E0001",
      httpStatusCode: 402,
      message: "Invalid username or email",
    },
    E0002: {
      code: "E0002",
      httpStatusCode: 404,
      message: "User not found",
    },
    E0003: {
      code: "E0003",
      httpStatusCode: 401,
      message: "Password is wrong",
    },
    E0004: {
      code: "E0004",
      httpStatusCode: 403,
      message: "Not permission",
    },
    E0005: {
      code: "E0005",
      httpStatusCode: 500,
      message: "Can't conntect rabbitMQ",
    },
    E0006: {
      code: "E0006",
      httpStatusCode: 401,
      message: "Unauthorizated",
    },
  },
  EVENT: {
    USER: {
      GET_LIST_BY_IDS: "GET_LIST_BY_IDS",
      GET_BY_ID: "GET_BY_ID",
      AUTH: "AUTH",
    },
  },
  CALL_OTHER_SERVICE_TIMEOUT: 10000,
  RABBITMQ: {
    CONNECTION_URL: "amqp://edu_microservice:edu_microservice%40@localhost",
    CHANNEL_TYPE: {
      RECEIVE: "receive",
      SEND: "send",
    },
  },
};
