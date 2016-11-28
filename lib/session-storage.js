﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const defaultName = "session-details";
const storageDir = path.join(os.homedir(), ".testdrivedevkit");

function read(name) {
    createStorageDir();

    var filename = getFileName(name);

    return JSON.parse(fs.readFileSync(filename, "utf-8").replace(/^\ufeff/, ''));
}

function write(sessionDetails, name) {
    createStorageDir();

    var filename = getFileName(name);

    fs.writeFileSync(filename, JSON.stringify(sessionDetails, null, 2), { encoding: "utf-8" });
}

function createStorageDir() {
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir);
    }
}

function getFileName(name) {
    return path.join(storageDir, (name || defaultName) + ".json");
}

module.exports = {
    read: read,
    write: write
};
