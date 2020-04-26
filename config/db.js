const mongoose = require('mongoose');
const colors = require('colors');

var connect = (connString) => {
    mongoose.connect(connString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err)
            console.log(colors.red('AN ERROR OCCURED WHILE CONNECTING TO DB'))
    }).then(
        () => console.log(colors.green('CONNECTED TO DB'))
    ).catch(() => console.log(colors.red('AN ERROR OCCURED WHILE CONNECTING TO DB')));
};


module.exports = {
    connect: connect
}