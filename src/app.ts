import initApp from "./server";
const port = process.env.PORT;
import http from 'http';
import https from 'https';
import fs from "fs";


initApp().then((app) => {
  if(process.env.NODE_ENV!=='production'){
    console.log('development');
    http.createServer(app).listen(process.env.PORT);
  } else{
    console.log('production')
    const options = {
      key: fs.readFileSync('../certs/client-key.pem'),
      cert: fs.readFileSync('../certs/client-cert.pem')
    };
  https.createServer(options, app).listen(process.env.PORT);
  }
  }).catch((err) => {
    console.error(err);
    });

