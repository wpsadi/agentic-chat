import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { auth } from "@repo/auth";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown'
import { OpenAPIHono } from "@hono/zod-openapi";
import { timeout } from "hono/timeout";


const app = new OpenAPIHono()

app.use( timeout( 10000 ) ) // 10 second timeout for all requests


app.on( ["POST", "GET"], "/api/auth/*", ( c ) => auth.handler( c.req.raw ) );


app.get( '/', Scalar( {
  url: '/api/auth/open-api/generate-schema',
  title: 'Auth Service API Reference',
  cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
  theme: 'none',
} ) )





app.get( '/llms.txt', async ( c ) => {
  const res = await fetch(
    `http://localhost:${PORT}/api/auth/open-api/generate-schema`
  )

  const schema = await res.text()

  const markdown = await createMarkdownFromOpenApi( schema )

  return c.text( markdown )
} )

const PORT = 12000;
serve( {
  fetch: app.fetch,
  port: PORT,
  autoCleanupIncoming: true,

} )
console.log( `Auth service is running on port ${PORT}` );