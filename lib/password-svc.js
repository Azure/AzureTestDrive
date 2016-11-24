//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

"use strict";

const _ = require("lodash");
const crypto = require("crypto");

const uppercase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const lowercase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const special = ["!", "#", "$", "%", "&", "*", "@", "^", "~", "+"];
const allChars = _.flatten([uppercase, lowercase, digits, special]);

function createPassword() {

    while (true) {
        var pwd = createRandomPassword();
        var quality = getPasswordQuality(pwd);

        if (quality >= 3) {
            return pwd.join("");
        }
    }

    ///////////////

    function createRandomPassword() {
        var result = [];
        var bytes = crypto.randomBytes(10);

        for (var value of bytes.values()) {
            result[result.length] = allChars[value % allChars.length];
        }

        return result;
    }

    function getPasswordQuality(pwd) {
        var quality = _.countBy(pwd, function (value) {
            if (_.includes(uppercase, value)) {
                return "uppercase";
            }

            if (_.includes(lowercase, value)) {
                return "lowercase";
            }

            if (_.includes(digits, value)) {
                return "digits";
            }

            return "special";
        });

        return _.keys(quality).length;
    }
}

module.exports = {
    createPassword: createPassword
};
