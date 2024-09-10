import mongoose from "mongoose";

const departamentoSchema = new mongoose.Schema(
  {
    codigo_departamento: {
      type: Number,
    },
    nombre: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const departamentoModel = mongoose.model("departamento", departamentoSchema);
