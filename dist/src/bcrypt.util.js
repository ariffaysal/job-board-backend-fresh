"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePasswords = comparePasswords;
const bcrypt = require("bcrypt");
async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
async function comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
}
//# sourceMappingURL=bcrypt.util.js.map