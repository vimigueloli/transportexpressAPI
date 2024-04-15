import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from 'fastify-type-provider-zod'

import { createDriver } from "./routes/drivers/post-driver";
import { deleteDriver } from "./routes/drivers/delete-driver";
import { editDriver } from "./routes/drivers/edit-driver";
import { getDriver } from "./routes/drivers/get-driver";
import { getDrivers } from "./routes/drivers/get-drivers";
import { createPath } from "./routes/paths/post-path";
import { deletePath } from "./routes/paths/delete-path";
import { editPath } from "./routes/paths/edit-path";
import { getPaths } from "./routes/paths/get-paths";
import { getPath } from "./routes/paths/get-path";
import { createTruck } from "./routes/trucks/post-truck";
import { deleteTruck } from "./routes/trucks/delete-trucks";
import { editTruck } from "./routes/trucks/edit-trucks";
import { getTrucks } from "./routes/trucks/get-trucks";
import { getTruck } from "./routes/trucks/get-truck";

export const app = fastify().withTypeProvider<ZodTypeProvider>()


// todo
app.register(fastifyCors, {
  origin: '*',
})

// ?  set the information on swagger UI
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'transportexpressAPI',
      description: 'Especificações da API voltada para gestão de transportadoras.',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform,
})

// ? set the swagger UI route
app.register(fastifySwaggerUI, {
  routePrefix: '/',
})

// todo
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//* callback to the app routes *//

// * driver routes * //
app.register(createDriver)
app.register(deleteDriver)
app.register(editDriver)
app.register(getDriver)
app.register(getDrivers)

// * truck routes * //
app.register(createTruck)
app.register(deleteTruck)
app.register(editTruck)
app.register(getTruck)
app.register(getTrucks)

// * path routes * //
app.register(createPath)
app.register(deletePath)
app.register(editPath)
app.register(getPath)
app.register(getPaths)


app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('Servidor Online 🌐 ✅')
})