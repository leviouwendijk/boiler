function renameKeys(data, keyMap) {
    Object.entries(keyMap).forEach(([oldKey, newKey]) => {
        if (data.hasOwnProperty(oldKey)) {
            data[newKey] = data[oldKey]; // Rename key
            delete data[oldKey]; // Remove old key
        } else {
            console.warn(`Key "${oldKey}" not found in data, skipping.`);
        }
    });
    return data;
}

function deleteKeys(data, keysToDelete) {
    keysToDelete.forEach((key) => {
        if (data.hasOwnProperty(key)) {
            delete data[key];
            console.log(`Key "${key}" deleted.`);
        } else {
            console.warn(`Key "${key}" not found in data, skipping deletion.`);
        }
    });
    return data;
}

module.exports = {
    renameKeys,
    deleteKeys
};
