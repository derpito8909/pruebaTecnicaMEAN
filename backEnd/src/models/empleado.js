import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema(
  {
    codigo: {
      type: Number,
    },
    nombre: {
      type: String,
    },
    apellido1: {
      type: String,
    },
    apellido2: {
      type: String,
    },
    codigo_departamento: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const empleadoModel = mongoose.model("empelado", empleadoSchema);
