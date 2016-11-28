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
else if (args[0] === "start") {
    require("./lib/start-command.js").run({
        settingsFileName: args[1]
    });
}
else if (args[0] === "status") {
    require("./lib/status-command.js").run({});
}
else if (args[0] === "operations") {
    require("./lib/operations-command.js").run({});
}
else {
    throw new Error(`Unknown command: ${args[0]}`);
}
