//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const _ = require("lodash");
const ArmSvc = require("./lib/arm-svc.js");
const chalk = require("chalk");
const fs = require("fs");
const logSvc = require("./lib/log-svc.js");
const Q = require("q");
const request = require("request");
const sessionDetailsSvc = require("./lib/session-details-svc.js");
const templateSvc = require("./lib/template-svc.js");
const uuid = require("uuid");

var args = process.argv.slice(2);

if (args[0] === "validate") {
    validateTemplate(args[1]);
}
else if (args[0] === "start") {
    startSession(args[1], args[2]);
}
else if (args[0] === "status") {
    getDeploymentStatus(args[1]);
}
else if (args[0] === "operations") {
    getDeploymentOperations(args[1]);
}
else if (args[0] === "stop") {
    stopSession(args[1]);
}
else {
    throw new Error(`Unknown command: ${args[0]}`);
}

return;

///////////////

function validateTemplate(templateFileName) {
    var templateJson = fs.readFileSync(templateFileName, "utf-8").replace(/^\ufeff/, '');

    var sessionDetails = {
        sessionId: uuid.v4(),
        baseUri: "https://aztestdrive.blob.core.windows.net/your-deployment-package/"
    };

    var parameters = templateSvc.createParameters(templateJson, sessionDetails);

    logSvc.info("Template is valid");
    logSvc.info("Parameters created");
    logSvc.verbose(JSON.stringify(parameters, null, 2));
}

function startSession(settingsFileName, sessionName) {
    var _armSvc = new ArmSvc();

    var settings = JSON.parse(fs.readFileSync(settingsFileName, "utf-8").replace(/^\ufeff/, ''));
    _armSvc.sessionDetails(sessionDetailsSvc.create(settings));

    Q.fcall(downloadTemplate)
        .then(createParameters)
        .then(_armSvc.authenticate)
        .then(_armSvc.createResourceGroup)
        .then(_armSvc.createDeployment)
        .done();

    return;

    ///////////////

    function downloadTemplate() {
        logSvc.info("Downloading template: ", _armSvc.sessionDetails().deploymentTemplateUri);

        var d = Q.defer();

        request(_armSvc.sessionDetails().deploymentTemplateUri, function (err, response, body) {
            if (err || response.statusCode != 200) {
                throw new Error(err);
            }

            var templateJson = body.replace(/^\ufeff/, '');

            logSvc.info("Template downloaded");

            d.resolve(templateJson);
        });

        return d.promise;
    }

    function createParameters(templateJson) {
        _armSvc.sessionDetails().parameters = templateSvc.createParameters(templateJson, _armSvc.sessionDetails());

        logSvc.info("Parameters created");
        logSvc.verbose(JSON.stringify(_armSvc.sessionDetails().parameters, null, 2));

        sessionDetailsSvc.write(_armSvc.sessionDetails(), sessionName);
    }
}

function getDeploymentStatus(sessionName) {
    var _armSvc = new ArmSvc();
    _armSvc.sessionDetails(sessionDetailsSvc.read(sessionName));

    Q.fcall(_armSvc.authenticate)
        .then(_armSvc.getDeployment)
        .then(getDeploymentStatus)
        .done();

    return;

    ///////////////

    function getDeploymentStatus(deploymentOutput) {
        var provisioningState = _.get(deploymentOutput, "properties.provisioningState", "").toLowerCase();

        if (provisioningState == "succeeded") {
            logSvc.info("Deployment Status: ", chalk.green.bold("Success"));
        }
        else if (provisioningState == "canceled" || provisioningState == "failed" || provisioningState == "deleted") {
            logSvc.info("Deployment Status: ", chalk.red.bold("Failure"));
        }
        else {
            logSvc.info("Deployment Status: ", chalk.yellow.bold("Running"));
        }
    }
}

function getDeploymentOperations(sessionName) {
    var _armSvc = new ArmSvc();
    _armSvc.sessionDetails(sessionDetailsSvc.read(sessionName));

    Q.fcall(_armSvc.authenticate)
        .then(_armSvc.getDeploymentOperations)
        .done();
}

function stopSession(sessionName) {
    var _armSvc = new ArmSvc();
    _armSvc.sessionDetails(sessionDetailsSvc.read(sessionName));

    Q.fcall(_armSvc.authenticate)
        .then(_armSvc.deleteResourceGroup)
        .done();
}
