import app from "./src/app";
import envVariables from "./src/config/index";
const {port} = envVariables;

app.listen(port, () => {
  console.log(`***** \nServer running on port ${port}\n*****`);
});
