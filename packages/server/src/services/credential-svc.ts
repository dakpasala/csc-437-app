// src/services/credential-svc.ts
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: true
    }
  },
  { collection: "user_credentials" }
);

const credentialModel = model<Credential>(
  "Credential",
  credentialSchema
);