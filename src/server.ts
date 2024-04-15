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
import { createMaintenance } from "./routes/maintenances/post-maintenance";
import { deleteMaintenance } from "./routes/maintenances/delete-maintenance";
import { editMaintenance } from "./routes/maintenances/edit-maintenance";
import { getMaintenance } from "./routes/maintenances/get-maintenance";
import { getMaintenances } from "./routes/maintenances/get-maintenances";
import { deleteRefuelling } from "./routes/refuellings/delete-refuelling";
import { createRefuelling } from "./routes/refuellings/post-refuelling";
import { editRefuelling } from "./routes/refuellings/edit-refuelling";
import { getRefuelling } from "./routes/refuellings/get-refuelling";
import { getRefuellings } from "./routes/refuellings/get-refuellings";
import { createTravel } from "./routes/travels/post-travel";
import { getTravels } from "./routes/travels/get-travels";
import { deleteTravel } from "./routes/travels/delete-travel";
import { editTravel } from "./routes/travels/edit-travel";
import { getTravel } from "./routes/travels/get-travel";

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

// * maintenance routes * //
app.register(createMaintenance)
app.register(deleteMaintenance)
app.register(editMaintenance)
app.register(getMaintenance)
app.register(getMaintenances)

// * refuelling routes * //
app.register(createRefuelling)
app.register(deleteRefuelling)
app.register(editRefuelling)
app.register(getRefuelling)
app.register(getRefuellings)

// * travel routes * //
app.register(createTravel)
app.register(deleteTravel)
app.register(editTravel)
app.register(getTravel)
app.register(getTravels)


app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('Servidor Online 🌐 ✅')
})
