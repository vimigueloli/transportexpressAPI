import {
  getTravels
} from "./chunk-TKZGHPVK.mjs";
import {
  createTravel
} from "./chunk-KK3QIULC.mjs";
import {
  createHash
} from "./chunk-B6ZM3WSB.mjs";
import {
  login
} from "./chunk-OHPYCBYS.mjs";
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
  getTrucks
} from "./chunk-E24K442C.mjs";
import {
  createTruck
} from "./chunk-7AWYIK2B.mjs";
import {
  deleteTravel
} from "./chunk-WRVUBA2I.mjs";
import {
  editTravel
} from "./chunk-GCPSILF6.mjs";
import {
  getTravel
} from "./chunk-AQUXWMRK.mjs";
import {
  getMaintenance
} from "./chunk-HMC2DBVY.mjs";
import {
  getMaintenances
} from "./chunk-SWS4HS6T.mjs";
import {
  createMaintenance
} from "./chunk-AWT24LB6.mjs";
import {
  deleteRefuelling
} from "./chunk-H7YR7NJO.mjs";
import {
  editRefuelling
} from "./chunk-KM5LPMJ2.mjs";
import {
  getRefuelling
} from "./chunk-AFZNDEGI.mjs";
import {
  getRefuellings
} from "./chunk-NERH5X76.mjs";
import {
  createRefuelling
} from "./chunk-A2XUPNEY.mjs";
import {
  createDriver
} from "./chunk-TCHHWVSE.mjs";
import {
  deletePath
} from "./chunk-KBMPMUIN.mjs";
import {
  editPath
} from "./chunk-YDW4XA4K.mjs";
import {
  getPath
} from "./chunk-WI4E6AXF.mjs";
import {
  getPaths
} from "./chunk-3OEW2QQW.mjs";
import {
  createPath
} from "./chunk-K3ZMEKSY.mjs";
import {
  deleteMaintenance
} from "./chunk-ENLM7VJN.mjs";
import {
  editMaintenance
} from "./chunk-YVLGADRN.mjs";
import "./chunk-EWYDLNHP.mjs";
import {
  deleteDriver
} from "./chunk-3SXYZO2N.mjs";
import {
  editDriver
} from "./chunk-N6C7KFWC.mjs";
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
