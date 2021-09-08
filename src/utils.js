
module.exports.hasPermission = function(permissions, permission) {
    return permissions.includes(permission) ||
        permissions.includes(32);
}

module.exports.newUserId = function() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var id = '';
    for (var i = 0; i < 28; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

module.exports.newId = function() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var id = '';
    for (var i = 0; i < 20; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

module.exports.randomPassword = function() {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=";
    var password = '';
    for (var i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}