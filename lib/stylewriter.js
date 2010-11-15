var _ = require('underscore')._;

/**
 * A library of data breaks algorithms
 */
var breaks = {
    /**
     * Quantile breaks in a dataset
     * @param {array}: data list of data.
     * @param {number}: n number of breaks.
     * @return {array} of break places.
     */
    quantile: function(data, n) {
        return _.select(data.sort(), function(val, index) {
            return index % (data.length / (n - 1)) == 0;
        }).concat(_.max(data));
    },

    /**
     * Equal breaks in a dataset
     * @param {array}: data list of data.
     * @param {number}: n number of breaks.
     * @return {array} of break places.
     */
    equal: function(data, n) {
        return _.range(_.min(data), _.max(data),
            (_.max(data) - _.min(data)) / (n - 1)).
            concat(_.max(data));
    }
};

/**
 * a color class
 *
 * @param {string} rgb a string of hexadecimal rgb.
 * @return {Color} a color object.
 */
var Color = function(rgb) {
    // Constructor
    if (this instanceof Color) {
        this.rgb = _.isArray(rgb) ? rgb :
        [
            parseInt(rgb.slice(0, 2), 16),
            parseInt(rgb.slice(2, 4), 16),
            parseInt(rgb.slice(4, 6), 16)
        ];
    }
    else {
        return new Color(rgb);
    }

    /*
     * @param {string} str: pad a string to a doublewide.
     * @return {string} padded string.
     */
    this.pad = function(str) {
        return (('' + str).length == 1) ? '0' + str : '' + str;
    };

    /**
     * @return {string} representation of color as a hex string.
     */
    this.hex = function() {
        return this.pad(this.rgb[0].toString(16)) +
            this.pad(this.rgb[1].toString(16)) +
            this.pad(this.rgb[2].toString(16));
    };

    /**
     * @param {Color} color a Color object.
     * @param {number} n number of steps in between colors.
     * @return {array} array of colors.
     */
    this.to = function(color, n) {
        return _.map(
            _.zip(
                _.map(Breaks.equal([this.rgb[0], color.rgb[0]], n), Math.round),
                _.map(Breaks.equal([this.rgb[1], color.rgb[1]], n), Math.round),
                _.map(Breaks.equal([this.rgb[2], color.rgb[2]], n), Math.round)
            ),
            Color);
    }

    this.blendnum = function(a, b, n) {
        return _.min([a, b]) + (Math.abs(a - b) * n);
    }

    /**
     * @param {Color} color a Color object.
     * @param {number} n percentage in between colors.
     * @return {array} array of colors.
     */
    this.blend = function(color, n) {
        return Color([
            Math.round(this.blendnum(this.rgb[0], color.rgb[0], n)),
            Math.round(this.blendnum(this.rgb[1], color.rgb[1], n)),
            Math.round(this.blendnum(this.rgb[2], color.rgb[2], n))]).hex();
    }
};

module.exports = {
    'Color': Color,
    'breaks': breaks
};
