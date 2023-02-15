const express = require('express');
const axios = require("axios");
const path = require('path');
const configuration = require('./configuration');
require('colors');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views/public')));
app.set('view engine', 'ejs');


app.get(`${configuration.page === "index" ? "/" : "/" + configuration.page}`, async (req, res) => {    
	let i = 0;
    
    res.render("status", {
        configuration,
        items: await Promise.all(
            configuration.status.map(async ({ name, url }) => {
                const getNumber = Boolean(await axios(url).catch(() => {}))
                if(getNumber === false) i++
                return {
                    name,
                    url,
                    online: Boolean(await axios(url).catch(() => {}))
                };
            })
        ),
        i
    });
});

app.listen(configuration.port, async(req, res) => {
    console.log("[Application] ".green + `Site disponbile sur le port ${configuration.port} !`)
    console.log("[Application] ".underline.blue + `${configuration.status.length} status chargé !`)
    console.log("[Credits] ".blue + `Site développé par DRIXEREX, ©️ ${new Date().getFullYear()} tous droits réservés`)
});