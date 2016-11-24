//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const fs = require("fs");
const logSvc = require("./log-svc.js");
const templateSvc = require("./template-svc.js");
const uuid = require("uuid");

function run(args) {
    var templateJson = fs.readFileSync(args.templateFileName, "utf-8").replace(/^\ufeff/, '');

    var sessionDetails = {
        sessionId: uuid.v4(),
        baseUri: "https://aztestdrive.blob.core.windows.net/your-deployment-package/"
    };

    var parameters = templateSvc.createParameters(templateJson, sessionDetails);

    logSvc.info("Template is valid");
    logSvc.info("Parameters created");
    logSvc.verbose(JSON.stringify(parameters, null, 2));
}

module.exports = {
    run: run
};
