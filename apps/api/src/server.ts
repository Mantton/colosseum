import app from "./app";
import { PORT } from "./v1/utils/env";

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
