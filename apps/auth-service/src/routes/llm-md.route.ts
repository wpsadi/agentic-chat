import { createRoute, z } from "@hono/zod-openapi";

const llmMdRoute = createRoute({
  method: 'get',
  path: '/llms.txt',
  responses: {
    200: {
      content: {
        'application/text': {
          schema: z.string(),
        },
      },
      description: 'API reference in markdown format',
    },
  },
})

export { llmMdRoute };