# Azure Test Drive

Azure Test Drive is a "try before you buy solution for Azure". We have a full <b>[Wiki](https://github.com/Azure/AzureTestDrive/wiki/home)</b> to walkthrough what a Test Drive is and how to build one!

Below is our prototype tool to helps you to develop, test, and debug your own Azure Test Drive ARM template solution.

# Azure Test Drive Dev Kit

* [Installation](#installation)
* [Quick Guide](#quick-guide)
  * [Validate](#validate)
  * [Start Session](#start-session)
  * [Get Deployment Status](#get-deployment-status)
  * [Get Deployment Operations](#get-deployment-operations)
  * [Stop Session](#stop-session)
* [Documentation](#documentation)

## Installation

This project uses **Node.js** and runs on Windows, Mac OS and Linux machines. Please follow the following steps to install the project:

1. Make sure you have **Node.js v6.9.1** or higher. Follow instructions on [this page](https://nodejs.org/en/download/) to install or update **Node.js**.

2. Clone the repository (or download the latest version):

  ```
  git clone https://github.com/Azure/AzureTestDrive.git
  ```

3. Install all dependencies:

  ```
  npm install
  ```

Now you can run Dev Kit tools using Node.js:

```
node test-drive.js [COMMAND] [PARAMETERS]
```

## Quick Guide

### Validate

The **validate** command performs the basic validation on your template, and displays the sample set of parameters which Azure Test Drive will use to instantiate a template.


```
node test-drive.js validate samples/contoso_simple_package/main-template.json
```

Output:

```
Template is valid
Parameters created
{
  "baseUri": {
    "value": "https://aztestdrive.blob.core.windows.net/your-deployment-package/"
  },
  "sessionId": {
    "value": "862b2264-fc3a-4ae1-a9e3-1e9cc2e2f95f"
  },
  "username": {
    "value": "admin41081"
  },
  "password": {
    "value": "UGo5igjz8j"
  }
}
```

See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information.

### Start Session

The **start session** command instantiates your template using the specified Azure subscription.

```
node test-drive.js start settings.json [<session-name>]
```

Where:

* **settings.json** is a file containing information which is required to instantiate the template.
* **session-name** is an optional session name. You can run multiple sessions in parallel by specifying different session names.

Output:

```
Session Details created
{
  "publisherId": ...
}
Downloading template: https://...
Template downloaded
Parameters created
{
  "baseUri": ...
}
Session Details saved
Signing in...
Signed in
Creating Resource Group: CloudTry_585f9917ac694989bede259efe941e49
Resource Group created
{
  "id": ...
}
Creating Deployment...
Deployment created
{
  "id": ...
}
```

Here is the sample **settings.json** (subscription id, tenant id, app id and app key parameters are not real):

```
{
  "$schema": "settings-schema.json",
  "publisherId": "contoso",
  "labId": "simple",
  "subscriptionInfo": {
    "subscriptionId": "12c51fe2-f7ee-46c6-8fc4-cc45069e8b97",
    "tenantId": "243d82c9-14d1-439a-91f8-546ec8708148",
    "appId": "313c023c-98bb-4492-ad10-49db39af81e1",
    "appKey": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  },
  "location": "westus",
  "deploymentTemplateUri": "https://aztestdrive.blob.core.windows.net/artifacts/contoso/simple/main-template.json",
  "baseUri": "https://aztestdrive.blob.core.windows.net/artifacts/contoso/simple/"
}
```

| Name                  | Data Type | Comments
| :-------------------- | :-------- | :-------
| publisherId           | String    | Publisher identifier (lower-case letters, digits and dash character only).
| labId                 | String    | Lab identifier (lower-case letters, digits and dash character only).
| subscriptionInfo      | Object    | Target subscription details.
| subscriptionId        | GUID      | Subscription Id.
| tenantId              | GUID      | Tenant Id.
| appId                 | GUID      | AD Application Id (see details below).
| appKey                | String    | AD Application password (see details below).
| location              | String    | Target deployment location.
| deploymentTemplateUri | Uri       | Uri of your deployment template somewhere on the PUBLIC blob storage (See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information).
| baseUri               | Uri       | Base Uri of your deployment template (See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information).

Please note, this project, as well as Azure Test Drive, use service principal to access your subscription. See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information.

### Get Deployment Status

Template deployment is a long-running operation. The **get deployment status** command displays the status of your deployment.

```
node test-drive.js status [<session-name>]
```

Output:

```
Session Details loaded
{
  "publisherId": ...
}
Signing in...
Signed in
Retrieving Deployment...
Deployment retrieved
{
  "id": ...
}
Deployment Status: Success
```

See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information.

### Get Deployment Operations

The **get deployment operations** command displays information about every deployment operation from your template:

```
node test-drive.js operations [<session-name>]
```

Output:

```
Session Details loaded
{
  "publisherId": ...
}
Signing in...
Signed in
Retrieving Deployment Operations...
Deployment Operations retrieved
[
  {
    "id": ...
  },
  ...
]
```

This information is also available through the [Azure Portal](https://portal.azure.com/). See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information.

### Stop Session

The **stop session** command performs a cleanup. Basically, it just deletes the resource group which was used for deployment:

```
node test-drive.js stop [<session-name>]
```

Output:

```
Session Details loaded
{
  "publisherId": ...
}
Signing in...
Signed in
Deleting Resource Group: CloudTry_585f9917ac694989bede259efe941e49
Resource Group scheduled for deletion
```

See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information.

## Documentation

* See [Azure Test Drive WIKI](https://github.com/Azure/AzureTestDrive/wiki) for more information.
* See [Authoring Test Drives](https://github.com/Azure/AzureTestDrive/wiki/Authoring-Test-Drives) for more information how to build, test and debug deployment packages for Azure Test Drive.
