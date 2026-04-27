import 'dotenv/config';
import server from './shared/server/server.js';
import connect from "./shared/config/database.js";

const port: number = parseInt(process.env.PORT || "") || 8000;

connect().then(() => {
    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
}).catch((err) => {
    console.log(err);
});

