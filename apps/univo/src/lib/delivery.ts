import "server-only";
import { getSiteEnv } from "@univo/config/server";
import { resolveDeliveryMode } from "@univo/leads";

/** True while forms only validate (no channel connected). The UI then says so before and after submit. */
export const isStagingDelivery = () => resolveDeliveryMode(process.env.LEAD_DELIVERY) === "staging";

/** The pre-submit "test mode" note is development messaging: never shown on a production site. */
export const showStagingNote = () => isStagingDelivery() && getSiteEnv() !== "production";
