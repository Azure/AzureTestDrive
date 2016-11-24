//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const _ = require("lodash");
const passwordSvc = require("./password-svc.js");

function createParameters(templateJson, sessionDetails) {

    var parameters = {};
    var templateObject = JSON.parse(templateJson);

    _.forEach(templateObject.parameters, function (value, key) {
        createParameter(key, value);
    });

    return parameters;

    ///////////////

    function createParameter(parameterName, parameterDefinition) {
        if (!_.isPlainObject(parameterDefinition)) {
            throw new Error(`Parameter definition is invalid, parameter name: ${parameterName}`);
        }

        if (!_.isPlainObject(parameterDefinition.metadata)) {
            if (parameterDefinition.defaultValue != null) {
                return;
            }

            throw new Error(`No metadata nor default value found, parameter name: ${parameterName}"`);
        }

        if (!_.isString(parameterDefinition.metadata.type)) {
            if (parameterDefinition.defaultValue != null) {
                return;
            }

            throw new Error(`No metadata nor default value found, parameter name: ${parameterName}"`);
        }

        var metaType = _.toLower(parameterDefinition.metadata.type);

        if (metaType === "baseuri") {
            createBaseUriParameter(parameterName, parameterDefinition);
        }
        else if (metaType === "sessionid") {
            createSessionIdParameter(parameterName, parameterDefinition);
        }
        else if (metaType === "username") {
            createUsernameParameter(parameterName, parameterDefinition);
        }
        else if (metaType === "password") {
            createPasswordParameter(parameterName, parameterDefinition);
        }
        else {
            throw new Error(`Metadata type is invalid, parameter name: ${parameterName}`);
        }
    }

    function createBaseUriParameter(parameterName, parameterDefinition) {
        ensureDataType(parameterName, "string", parameterDefinition.type);

        parameters[parameterName] = {
            value: sessionDetails.baseUri
        };
    }

    function createSessionIdParameter(parameterName, parameterDefinition) {
        ensureDataType(parameterName, "string", parameterDefinition.type);

        parameters[parameterName] = {
            value: sessionDetails.sessionId
        };
    }

    function createUsernameParameter(parameterName, parameterDefinition) {
        ensureDataType(parameterName, "string", parameterDefinition.type);

        var username = "admin" + _.padStart(_.toString(Math.floor(Math.random() * 100000)), 5, "0");

        parameters[parameterName] = {
            value: username
        };
    }

    function createPasswordParameter(parameterName, parameterDefinition) {
        ensureDataType(parameterName, "securestring", parameterDefinition.type);

        var password = passwordSvc.createPassword();

        parameters[parameterName] = {
            value: password
        };
    }

    function ensureDataType(parameterName, expected, actual) {
        expected = _.toLower(expected);
        actual = _.toLower(actual);

        if (expected !== actual) {
            throw new Error(`Data type doesn't match metadata type, parameter name: ${parameterName}, expected: ${expected}, actual: ${actual}`);
        }
    }
}

module.exports = {
    createParameters: createParameters
};
