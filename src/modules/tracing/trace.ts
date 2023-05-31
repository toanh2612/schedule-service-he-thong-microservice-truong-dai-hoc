"use strict";

const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { OTTracePropagator } = require("@opentelemetry/propagator-ot-trace");
const {
  NestInstrumentation,
} = require("@opentelemetry/instrumentation-nestjs-core");

const hostName = process.env.OTEL_TRACE_HOST || "localhost";

const options = {
  tags: [],
  endpoint: `http://${hostName}:14268/api/traces`,
};

export const initTrace = (serviceName, environment) => {
  // User Collector Or Jaeger Exporter
  //const exporter = new CollectorTraceExporter(options)

  const exporter = new JaegerExporter(options);

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName, // Service name that showuld be listed in jaeger ui
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    }),
  });

  //provider.addSpanProcessor(new SimpleSpanProcessor(exporter))

  // Use the BatchSpanProcessor to export spans in batches in order to more efficiently use resources.
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Enable to see the spans printed in the console by the ConsoleSpanExporter
  // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))

  provider.register({ propagator: new OTTracePropagator() });

  console.log("tracing initialized");

  registerInstrumentations({
    instrumentations: [
      new ExpressInstrumentation(),
      new HttpInstrumentation(),
      new NestInstrumentation(),
    ],
  });

  const tracer = provider.getTracer(serviceName);
  return { tracer };
};
