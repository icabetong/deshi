const hasPermission = (permissions, permission) => {
    return permissions.includes(permission) ||
        permissions.includes(32);
}

module.exports = hasPermission;