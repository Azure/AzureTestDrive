//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

var args = process.argv.slice(2);

if (args[0] === "validate") {
    require("./lib/validate-command.js").run({
        templateFileName: args[1]
    });
}
else {
    throw new Error(`Unknown command: ${args[0]}`);
}
