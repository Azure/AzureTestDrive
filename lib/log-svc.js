//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const chalk = require("chalk");

function info() {
    console.log(createMessage.apply(null, arguments));
}

function verbose() {
    console.log(chalk.gray(createMessage.apply(null, arguments)));
}

function createMessage() {
    return Array.prototype.slice.call(arguments).join("");
}

module.exports = {
    info: info,
    verbose: verbose
};
