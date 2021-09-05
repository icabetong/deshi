
module.exports.hasPermission = function(permissions, permission) {
    return permissions.includes(permission) ||
        permissions.includes(32);
}