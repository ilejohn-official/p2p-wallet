import app from "./src/app";

let port = 5000;

app.listen(port, () => {
  console.log(`***** \nServer running on port ${port}\n*****`);
});
