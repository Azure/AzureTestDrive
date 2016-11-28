//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

const azureArmResource = require("azure-arm-resource");
const logSvc = require("./log-svc.js");
const msRestAzure = require("ms-rest-azure");
const Q = require("q");

const deploymentName = "deployment-1";

function ArmSvc(sessionDetails) {

    var _resManClient = null;

    this.authenticate = authenticate;
    this.createResourceGroup = createResourceGroup;
    this.createDeployment = createDeployment;

    return;

    ///////////////

    function authenticate(subscriptionInfo) {
        logSvc.info("Signing in...");

        var d = Q.defer();

        msRestAzure.loginWithServicePrincipalSecret(subscriptionInfo.appId, subscriptionInfo.appKey, subscriptionInfo.tenantId, function (err, credentials) {
            if (err) {
                throw new Error(err);
            }

            _resManClient = new azureArmResource.ResourceManagementClient(credentials, subscriptionInfo.subscriptionId);

            logSvc.info("Signed in");

            d.resolve();
        });

        return d.promise;
    }

    function createResourceGroup(sessionDetails) {
        logSvc.info("Creating Resource Group: ", sessionDetails.resourceGroupName);

        var d = Q.defer();

        // https://docs.microsoft.com/en-us/rest/api/resources/resourcegroups#ResourceGroups_CreateOrUpdate
        var parameters = {
            location: sessionDetails.location,
            tags: {
                "PublisherId": sessionDetails.publisherId,
                "LabId": sessionDetails.labId,
                "Revision": sessionDetails.revision,
                "SessionId": sessionDetails.sessionId
            }
        };

        _resManClient.resourceGroups.createOrUpdate(sessionDetails.resourceGroupName, parameters, function (err, result) {
            if (err) {
                throw new Error(err);
            }

            logSvc.info("Resource Group created");
            logSvc.verbose(JSON.stringify(result, null, 2));

            d.resolve();
        });

        return d.promise;
    }

    function createDeployment(sessionDetails) {
        logSvc.info("Creating Deployment...");

        var d = Q.defer();

        // https://docs.microsoft.com/en-us/rest/api/resources/deployments#Deployments_CreateOrUpdate
        var parameters = {
            properties: {
                templateLink: {
                    uri: sessionDetails.deploymentTemplateUri
                },
                parameters: sessionDetails.parameters,
                mode: "Incremental",
                debugSetting: {
                    detailLevel: "None"
                }
            }
        };

        _resManClient.deployments.beginCreateOrUpdate(sessionDetails.resourceGroupName, "deployment-1", parameters, function (err, result) {
            if (err) {
                throw new Error(err);
            }

            logSvc.info("Deployment created");
            logSvc.verbose(JSON.stringify(result, null, 2));

            d.resolve();
        });

        return d.promise;
    }
}

module.exports = ArmSvc;
