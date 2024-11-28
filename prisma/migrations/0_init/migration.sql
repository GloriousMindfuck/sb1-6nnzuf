-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CONSULTOR');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('INGRESO', 'GASTO');

-- CreateEnum
CREATE TYPE "EstadoExpediente" AS ENUM ('PAGADO', 'ABIERTO', 'CERRADO', 'PENDIENTE', 'FALTAN_FIRMAS');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('CHEQUE', 'TRANSFERENCIA', 'EFECTIVO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'CONSULTOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expediente" (
    "id" TEXT NOT NULL,
    "numeroExpediente" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "TipoMovimiento" NOT NULL,
    "color" TEXT NOT NULL,
    "colorBibliorato" TEXT,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoExpediente" NOT NULL,
    "creadoPor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BancoMovimiento" (
    "id" TEXT NOT NULL,
    "fechaMovimiento" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT NOT NULL,
    "expedienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BancoMovimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanillaExcel" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "expedienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanillaExcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "expedienteId" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoPago" NOT NULL,
    "chequeNumero" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "notas" TEXT,
    "creadoPor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expedienteId" TEXT,
    "accion" TEXT NOT NULL,
    "detalles" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "archivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoPor" TEXT NOT NULL,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Expediente_numeroExpediente_key" ON "Expediente"("numeroExpediente");

-- CreateIndex
CREATE INDEX "Expediente_fechaIngreso_idx" ON "Expediente"("fechaIngreso");

-- CreateIndex
CREATE INDEX "Expediente_tipo_idx" ON "Expediente"("tipo");

-- CreateIndex
CREATE INDEX "Expediente_estado_idx" ON "Expediente"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "BancoMovimiento_expedienteId_key" ON "BancoMovimiento"("expedienteId");

-- CreateIndex
CREATE INDEX "BancoMovimiento_fechaMovimiento_idx" ON "BancoMovimiento"("fechaMovimiento");

-- CreateIndex
CREATE INDEX "BancoMovimiento_tipo_idx" ON "BancoMovimiento"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "PlanillaExcel_expedienteId_key" ON "PlanillaExcel"("expedienteId");

-- CreateIndex
CREATE INDEX "PlanillaExcel_fechaIngreso_idx" ON "PlanillaExcel"("fechaIngreso");

-- CreateIndex
CREATE INDEX "Pago_fecha_idx" ON "Pago"("fecha");

-- CreateIndex
CREATE INDEX "Pago_expedienteId_idx" ON "Pago"("expedienteId");

-- CreateIndex
CREATE INDEX "Log_usuarioId_idx" ON "Log"("usuarioId");

-- CreateIndex
CREATE INDEX "Log_expedienteId_idx" ON "Log"("expedienteId");

-- CreateIndex
CREATE INDEX "Log_createdAt_idx" ON "Log"("createdAt");

-- AddForeignKey
ALTER TABLE "BancoMovimiento" ADD CONSTRAINT "BancoMovimiento_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanillaExcel" ADD CONSTRAINT "PlanillaExcel_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente"("id") ON DELETE SET NULL ON UPDATE CASCADE;