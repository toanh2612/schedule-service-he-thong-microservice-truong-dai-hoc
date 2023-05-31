import { Injectable, NestMiddleware } from "@nestjs/common";
import { Context, SpanKind, Tracer, trace, AttributeValue } from "@opentelemetry/api";
import { NextFunction, Request, Response, } from "express";
const { init } = require("../tracing/trace");
init("restful-api-schedule-service", "development");
@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private tracer: Tracer) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // const traceId = v4();
      // const activeSpan = api.trace.getSpan(api.context.active());
      // activeSpan.addEvent(req.baseUrl, {
      //   index: traceId,
      //   kind: SpanKind.CLIENT,n
      // });
      // const data: Context = 'cc'
      trace.
      const parentSpan = this.tracer.startSpan("HTTP Request", {
        root: true,
        kind: SpanKind.CLIENT
      });
      parentSpan.addEvent("Call API");
      // parentSpan.setAttribute("parent", parentSpan)
      // const span = this.tracer.startSpan('HTTP Request', {
      //   parent: parentSpan,
      //   kind: SpanKind.SERVER,
      // });
  
      // Generate a unique trace ID
      // const traceId = span.context().traceId;
  
      // Pass the trace ID to the downstream services
      // req.headers['trace-id'] = traceId;
  
      // Add the span to the request for later use
      // req.span = span;
  
      return next();
    } catch (error) {
      return res.json({
        error,
      });
    }
  }
}
