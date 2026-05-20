import { define } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { LoginFormElement } from "../../proto/public/src/login-form.js";

define({
  "auth-provider": Auth.Provider,
  "login-form": LoginFormElement
});