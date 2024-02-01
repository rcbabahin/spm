import express from "express";
import knex from "knex";
import cors from "cors";
import bcrypt from "bcryptjs";
import 'dotenv/config.js';

import { handleRegister } from "./controllers/register.js";
import { handleSignup } from "./controllers/singup.js";
import { handleSignin } from "./controllers/signin.js";
import { 
    handleDeleteDevice, 
    handleGetAllDevices, 
    handleGetDeviceById, 
    handleUpdateDevice 
} from "./controllers/devices.js";
import { 
    handleGetAllMeasurements, 
    handleGetMeasurementById 
} from "./controllers/measurements.js";

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_EXT_LINK,
      	ssl: {
        	rejectUnauthorized: false
      	}
    }
});

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.type('html').send(rootHtml));
app.get('/devices', handleGetAllDevices(db));
app.get('/device/:id', handleGetDeviceById(db));
app.delete('/device/:id', handleDeleteDevice(db));
app.put('/device/:id', handleUpdateDevice(db));

app.get('/measurements', handleGetAllMeasurements(db));
app.get('/measurement/:id', handleGetMeasurementById(db));

app.post('/register', handleRegister(db));
app.post('/signup', handleSignup(db, bcrypt));
app.post('/signin', handleSignin(db, bcrypt));

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})

const rootHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
