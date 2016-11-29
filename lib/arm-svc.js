//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

const azureArmResource = require("azure-arm-resource");
const logSvc = require("./log-svc.js");
const msRestAzure = require("ms-rest-azure");
const Q = require("q");

const deploymentName = "deployment-1";

function ArmSvc() {
    var _sessionDetails = null;
    var _resManClient = null;

    this.sessionDetails = sessionDetails;
    this.authenticate = authenticate;
    this.createResourceGroup = createResourceGroup;
    this.deleteResourceGroup = deleteResourceGroup;
    this.createDeployment = createDeployment;
    this.getDeployment = getDeployment;
    this.getDeploymentOperations = getDeploymentOperations;

    return;

    ///////////////

    function sessionDetails(sessionDetails) {
        if (!sessionDetails) {
            return _sessionDetails;
        }

        _sessionDetails = sessionDetails;
    }

    function authenticate() {
        logSvc.info("Signing in...");

        var d = Q.defer();

        msRestAzure.loginWithServicePrincipalSecret(_sessionDetails.subscriptionInfo.appId, _sessionDetails.subscriptionInfo.appKey, _sessionDetails.subscriptionInfo.tenantId, function (err, credentials) {
            if (err) {
                throw new Error(err);
            }

            _resManClient = new azureArmResource.ResourceManagementClient(credentials, _sessionDetails.subscriptionInfo.subscriptionId);

            logSvc.info("Signed in");

            d.resolve();
        });

        return d.promise;
    }

    function createResourceGroup() {
        logSvc.info("Creating Resource Group: ", _sessionDetails.resourceGroupName);

        var d = Q.defer();

        // https://docs.microsoft.com/en-us/rest/api/resources/resourcegroups#ResourceGroups_CreateOrUpdate
        var parameters = {
            location: _sessionDetails.location,
            tags: {
                "PublisherId": _sessionDetails.publisherId,
                "LabId": _sessionDetails.labId,
                "Revision": _sessionDetails.revision,
                "SessionId": _sessionDetails.sessionId
            }
        };

        _resManClient.resourceGroups.createOrUpdate(_sessionDetails.resourceGroupName, parameters, function (err, result) {
            if (err) {
                throw new Error(err);
            }

            logSvc.info("Resource Group created");
            logSvc.verbose(JSON.stringify(result, null, 2));

            d.resolve();
        });

        return d.promise;
    }

    function deleteResourceGroup() {
        logSvc.info("Deleting Resource Group: ", _sessionDetails.resourceGroupName);

        var d = Q.defer();

        _resManClient.resourceGroups.beginDeleteMethod(_sessionDetails.resourceGroupName, function (err) {
            if (err) {
                throw new Error(err);
            }

            logSvc.info("Resource Group scheduled for deletion");

            d.resolve();
        });

        return d.promise;
    }

    function createDeployment() {
        logSvc.info("Creating Deployment...");

        var d = Q.defer();

        // https://docs.microsoft.com/en-us/rest/api/resources/deployments#Deployments_CreateOrUpdate
        var parameters = {
            properties: {
                templateLink: {
                    uri: _sessionDetails.deploymentTemplateUri
                },
                parameters: _sessionDetails.parameters,
                mode: "Incremental",
                debugSetting: {
                    detailLevel: "None"
                }
            }
        };

        _resManClient.deployments.beginCreateOrUpdate(_sessionDetails.resourceGroupName, deploymentName, parameters, function (err, result) {
            if (err) {
                throw new Error(err);
            }

            logSvc.info("Deployment created");
            logSvc.verbose(JSON.stringify(result, null, 2));

            d.resolve();
        });

        return d.promise;
    }

    function getDeployment() {
        logSvc.info("Retrieving Deployment...");

        var d = Q.defer();

        _resManClient.deployments.get(_sessionDetails.resourceGroupName, deploymentName, function (err, result) {
            if (err) {
                throw new Error(err);
            }

            logSvc.info("Deployment retrieved");
            logSvc.verbose(JSON.stringify(result, null, 2));

            d.resolve(result);
        });

        return d.promise;
    }

    function getDeploymentOperations() {
        logSvc.info("Retrieving Deployment Operations...");

        var d = Q.defer();

        _resManClient.deploymentOperations.list(_sessionDetails.resourceGroupName, deploymentName, function (err, result) {
            if (err) {
                throw new Error(err);
            }

            logSvc.info("Deployment Operations retrieved");
            logSvc.verbose(JSON.stringify(result, null, 2));

            d.resolve(result);
        });

        return d.promise;
    }
}

module.exports = ArmSvc;
