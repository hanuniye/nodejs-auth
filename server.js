const { app, port } = require("./index");

const start = () => {
    app.listen(port, console.log(`App s listining on PORT: ${port}`));
}

start();