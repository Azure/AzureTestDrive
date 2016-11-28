//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const _ = require("lodash");
const ArmSvc = require("./arm-svc.js");
const logSvc = require("./log-svc.js");
const Q = require("q");
const sessionStorage = require("./session-storage.js");

function run(args) {

    var _armSvc = new ArmSvc();
    var _sessionDetails = getSessionDetails();

    Q.fcall(function () {
        return _armSvc.authenticate(_sessionDetails.subscriptionInfo);
    })
        .then(function () {
            return _armSvc.getDeploymentOperations(_sessionDetails);
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
}

module.exports = {
    run: run
};
