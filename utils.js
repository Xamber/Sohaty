// Create zip function
const zip = (...arrays) => {
    const length = Math.min(...arrays.map(arr => arr.length));
    return Array.from({length}, (value, index) => arrays.map((array => array[index])));
};

// Improve Storage object
Storage.prototype._setItem = Storage.prototype.setItem;
Storage.prototype.setItem = function (key, value) {
    this._setItem(key, JSON.stringify(value));
};

Storage.prototype._getItem = Storage.prototype.getItem;
Storage.prototype.getItem = function (key) {
    try {
        return JSON.parse(this._getItem(key));
    }
    catch (e) {
        return this._getItem(key);
    }
};


