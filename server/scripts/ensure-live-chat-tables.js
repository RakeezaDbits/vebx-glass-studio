import "dotenv/config";
import { ensureLiveChatTables } from "../utils/ensureLiveChatTables.js";

ensureLiveChatTables()
  .then(() => {
    console.log("live_chat_sessions + live_chat_messages are ready.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
