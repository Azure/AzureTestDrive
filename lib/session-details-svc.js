﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const fs = require("fs");
const logSvc = require("./log-svc.js");
const os = require("os");
const path = require("path");
const uuid = require("uuid");

const storageDir = path.join(os.homedir(), ".testdrivedevkit");

function create(settings) {
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

function read(name) {
    createStorageDir();

    var filename = getFileName(name);
    var sessionDetails = JSON.parse(fs.readFileSync(filename, "utf-8").replace(/^\ufeff/, ''));

    logSvc.info("Session Details loaded");
    logSvc.verbose(JSON.stringify(sessionDetails, null, 2));

    return sessionDetails;
}

function write(sessionDetails, name) {
    createStorageDir();

    var filename = getFileName(name);
    fs.writeFileSync(filename, JSON.stringify(sessionDetails, null, 2), { encoding: "utf-8" });

    logSvc.info("Session Details saved");
}

function createStorageDir() {
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir);
    }
}

function getFileName(name) {
    return path.join(storageDir, (name || "session-details") + ".json");
}

module.exports = {
    create: create,
    read: read,
    write: write
};
