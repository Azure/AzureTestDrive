﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const ArmSvc = require("./arm-svc.js");
const fs = require("fs");
const logSvc = require("./log-svc.js");
const Q = require("q");
const request = require("request");
const sessionStorage = require("./session-storage.js");
const templateSvc = require("./template-svc.js");
const uuid = require("uuid");

function run(args) {

    var _armSvc = new ArmSvc();
    var _sessionDetails = createSessionDetails(args.settingsFileName);
    var _templateJson;

    Q.fcall(downloadTemplate)
        .then(createParameters)
        .then(function () {
            return _armSvc.authenticate(_sessionDetails.subscriptionInfo);
        })
        .then(function () {
            return _armSvc.createResourceGroup(_sessionDetails);
        })
        .then(function () {
            return _armSvc.createDeployment(_sessionDetails);
        })
        .done();

    return;

    ///////////////

    function createSessionDetails(settingsFileName) {
        var settings = JSON.parse(fs.readFileSync(settingsFileName, "utf-8").replace(/^\ufeff/, ''));
        var sessionId = uuid.v4();
        var resourceGroupName = "CloudTry_" + sessionId.replace(/-/g, "");

        var sessionDetails = {
            publisherId: settings.publisherId,
            labId: settings.labId,
            revision: "1",
            sessionId: sessionId,
            subscriptionInfo: {
                subscriptionId: settings.subscriptionInfo.subscriptionId,
                tenantId: settings.subscriptionInfo.tenantId,
                appId: settings.subscriptionInfo.appId,
                appKey: settings.subscriptionInfo.appKey
            },
            resourceGroupName: resourceGroupName,
            location: settings.location,
            deploymentTemplateUri: settings.deploymentTemplateUri,
            baseUri: settings.baseUri
        };

        logSvc.info("Session Details created");
        logSvc.verbose(JSON.stringify(sessionDetails, null, 2));

        return sessionDetails;
    }

    function downloadTemplate() {
        logSvc.info("Downloading template: ", _sessionDetails.deploymentTemplateUri);

        var d = Q.defer();

        request(_sessionDetails.deploymentTemplateUri, function (err, response, body) {
            if (err || response.statusCode != 200) {
                throw new Error(err);
            }

            _templateJson = body.replace(/^\ufeff/, '');

            logSvc.info("Template downloaded");

            d.resolve();
        });

        return d.promise;
    }

    function createParameters() {
        _sessionDetails.parameters = templateSvc.createParameters(_templateJson, _sessionDetails);

        sessionStorage.write(_sessionDetails);

        logSvc.info("Parameters created");
        logSvc.verbose(JSON.stringify(_sessionDetails.parameters, null, 2));
    }
}

module.exports = {
    run: run
};
