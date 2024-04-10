-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT,

    CONSTRAINT "driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "truck" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "renavan" TEXT,

    CONSTRAINT "truck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route" (
    "id" SERIAL NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "suggested_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance" (
    "id" SERIAL NOT NULL,
    "obs" TEXT NOT NULL,
    "truck_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,

    CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refuelling" (
    "id" SERIAL NOT NULL,
    "liters" DECIMAL(65,30) NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "truck_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,

    CONSTRAINT "refuelling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel" (
    "id" SERIAL NOT NULL,
    "urban" BOOLEAN NOT NULL DEFAULT false,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "prize" DECIMAL(65,30) NOT NULL,
    "commission" DECIMAL(65,30) NOT NULL,
    "client" TEXT,
    "toll_prize" DECIMAL(65,30),
    "truck_plate" TEXT NOT NULL,
    "driver_id" INTEGER NOT NULL,

    CONSTRAINT "travel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "truck_plate_key" ON "truck"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "travel_number_key" ON "travel"("number");

-- AddForeignKey
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_truck_id_fkey" FOREIGN KEY ("truck_id") REFERENCES "truck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refuelling" ADD CONSTRAINT "refuelling_truck_id_fkey" FOREIGN KEY ("truck_id") REFERENCES "truck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refuelling" ADD CONSTRAINT "refuelling_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel" ADD CONSTRAINT "travel_truck_plate_fkey" FOREIGN KEY ("truck_plate") REFERENCES "truck"("plate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel" ADD CONSTRAINT "travel_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
