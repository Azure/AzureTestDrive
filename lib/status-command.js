//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const _ = require("lodash");
const ArmSvc = require("./arm-svc.js");
const chalk = require("chalk");
const logSvc = require("./log-svc.js");
const Q = require("q");
const sessionStorage = require("./session-storage.js");

const DeploymentStatus = {
    Running: 0,
    Success: 1,
    Failure: 2
}

function run(args) {

    var _armSvc = new ArmSvc();
    var _sessionDetails = getSessionDetails();

    Q.fcall(function () {
        return _armSvc.authenticate(_sessionDetails.subscriptionInfo);
    })
        .then(function () {
            return _armSvc.getDeployment(_sessionDetails);
        })
        .then(function (deploymentOutput) {
            var deploymentStatus = getDeploymentStatus(deploymentOutput);

            switch (deploymentStatus) {
                case DeploymentStatus.Success:
                    logSvc.info("Deployment Status: ", chalk.green.bold("Success"));
                    break;

                case deploymentStatus.Failure:
                    logSvc.info("Deployment Status: ", chalk.red.bold("Failure"));
                    break;

                default:
                    logSvc.info("Deployment Status: ", chalk.yellow.bold("Running"));
            }
        })
        .done();

    return;

    ///////////////

    function getSessionDetails() {
        var sessionDetails = sessionStorage.read();

        logSvc.info("Session Details loaded");
        logSvc.verbose(JSON.stringify(sessionDetails, null, 2));

        return sessionDetails;
    }

    function getDeploymentStatus(deploymentOutput) {
        var provisioningState = _.get(deploymentOutput, "properties.provisioningState", "").toLowerCase();

        if (provisioningState == "succeeded") {
            return DeploymentStatus.Success;
        }

        if (provisioningState == "canceled" || provisioningState == "failed" || provisioningState == "deleted") {
            return DeploymentStatus.Failure;
        }

        return DeploymentStatus.Running;
    }
}

module.exports = {
    run: run
};
