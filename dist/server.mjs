import {
  getTrucks
} from "./chunk-E24K442C.mjs";
import {
  createTruck
} from "./chunk-7AWYIK2B.mjs";
import {
  createHash
} from "./chunk-B6ZM3WSB.mjs";
import {
  login
} from "./chunk-OHPYCBYS.mjs";
import {
  deleteTravel
} from "./chunk-WRVUBA2I.mjs";
import {
  editTravel
} from "./chunk-YA6XD4WC.mjs";
import {
  getTravel
} from "./chunk-AQUXWMRK.mjs";
import {
  getTravels
} from "./chunk-GOOIQV6X.mjs";
import {
  createTravel
} from "./chunk-ZM2CVJHL.mjs";
import {
  deleteTruck
} from "./chunk-HZBNNKAD.mjs";
import {
  editTruck
} from "./chunk-3VB2Z3MR.mjs";
import {
  getTruck
} from "./chunk-LRMJTOF3.mjs";
import {
  getPath
} from "./chunk-WI4E6AXF.mjs";
import {
  getPaths
} from "./chunk-LMV43QAF.mjs";
import {
  createPath
} from "./chunk-K3ZMEKSY.mjs";
import {
  deleteRefuelling
} from "./chunk-H7YR7NJO.mjs";
import {
  editRefuelling
} from "./chunk-IAPKJUJ5.mjs";
import {
  getRefuelling
} from "./chunk-AFZNDEGI.mjs";
import {
  getRefuellings
} from "./chunk-NERH5X76.mjs";
import {
  createRefuelling
} from "./chunk-R26D5U4F.mjs";
import {
  createDriver
} from "./chunk-PK234H6Y.mjs";
import {
  deleteMaintenance
} from "./chunk-ENLM7VJN.mjs";
import {
  editMaintenance
} from "./chunk-BIL2SDFC.mjs";
import {
  getMaintenance
} from "./chunk-HMC2DBVY.mjs";
import {
  getMaintenances
} from "./chunk-SWS4HS6T.mjs";
import {
  createMaintenance
} from "./chunk-BP25QFYZ.mjs";
import {
  deletePath
} from "./chunk-KBMPMUIN.mjs";
import {
  editPath
} from "./chunk-YDW4XA4K.mjs";
import "./chunk-EWYDLNHP.mjs";
import {
  deleteDriver
} from "./chunk-3SXYZO2N.mjs";
import {
  editDriver
} from "./chunk-GJ4BA5OV.mjs";
import {
  getDriver
} from "./chunk-PNKUSYIK.mjs";
import {
  getDrivers
} from "./chunk-MXKFO3XN.mjs";
import "./chunk-7T33RQXO.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "transportexpressAPI",
      description: "Especifica\xE7\xF5es da API voltada para gest\xE3o de transportadoras.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createDriver);
app.register(deleteDriver);
app.register(editDriver);
app.register(getDriver);
app.register(getDrivers);
app.register(createTruck);
app.register(deleteTruck);
app.register(editTruck);
app.register(getTruck);
app.register(getTrucks);
app.register(createPath);
app.register(deletePath);
app.register(editPath);
app.register(getPath);
app.register(getPaths);
app.register(createMaintenance);
app.register(deleteMaintenance);
app.register(editMaintenance);
app.register(getMaintenance);
app.register(getMaintenances);
app.register(createRefuelling);
app.register(deleteRefuelling);
app.register(editRefuelling);
app.register(getRefuelling);
app.register(getRefuellings);
app.register(createTravel);
app.register(deleteTravel);
app.register(editTravel);
app.register(getTravel);
app.register(getTravels);
app.register(createHash);
app.register(login);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Servidor Online \u{1F310} \u2705");
});
export {
  app
};
