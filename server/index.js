import "dotenv/config";
import app, { initialize } from "./app.js";

app.listen(process.env.PORT, async () => {
  console.log(`Game running on http://localhost:${process.env.PORT}`);

  await initialize();
});
