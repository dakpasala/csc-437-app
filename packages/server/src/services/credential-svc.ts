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

function create(username: string, password: string): Promise<Credential> {
    return credentialModel
        .find({ username })
        .then((found: Credential[]) => {
        if (found.length) throw `Username exists: ${username}`
    })
    .then(() =>
        bcrypt
            .genSalt(10)
            .then((salt: string) => bcrypt.hash(password, salt))
            .then((hashedPassword: string) => {
                const creds = new credentialModel({
                    username,
                    hashedPassword
            });
            return creds.save();
        })
    );
}