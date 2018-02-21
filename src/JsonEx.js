/**
 *   <NDZServer it is a program for creating a safe community and innovative>
 *   NDZServer Copyright (C) 2018 GuilhermeSantos001, Inc. <https://github.com/GuilhermeSantos001/NDZServer>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://github.com/GuilhermeSantos001/NDZServer/blob/master/LICENSE>
 *
 *   To enter in contact with the developer <luizgp120@hotmail.com>
 */

//-----------------------------------------------------------------------------
/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
export default function JsonEx() {
    var JsonEx = {
        maxDepth: 100,
        id: 1,
        _generateId: function () {
            return JsonEx.id++;
        },
        _restoreCircularReference: function (circulars) {
            circulars.forEach(function (circular) {
                var key = circular[0];
                var value = circular[1];
                var content = circular[2];
                value[key] = content;
            });
        },
        _linkCircularReference: function (contents, circulars, registry) {
            circulars.forEach(function (circular) {
                var key = circular[0];
                var value = circular[1];
                var id = circular[2];
                value[key] = registry[id];
            });
        },
        _cleanMetadata: function (object) {
            if (!object) return;

            delete object['@'];
            delete object['@c'];

            if (typeof object === 'object') {
                Object.keys(object).forEach(function (key) {
                    var value = object[key];
                    if (typeof value === 'object') {
                        JsonEx._cleanMetadata(value);
                    }
                });
            }
        },
        _encode: function (value, circular, depth) {
            depth = depth || 0;
            if (++depth >= JsonEx.maxDepth) {
                throw new Error('Object too deep');
            }
            var type = Object.prototype.toString.call(value);
            if (type === '[object Object]' || type === '[object Array]') {
                value['@c'] = JsonEx._generateId();

                var constructorName = JsonEx._getConstructorName(value);
                if (constructorName !== 'Object' && constructorName !== 'Array') {
                    value['@'] = constructorName;
                }
                for (var key in value) {
                    if (value.hasOwnProperty(key) && !key.match(/^@./)) {
                        if (value[key] && typeof value[key] === 'object') {
                            if (value[key]['@c']) {
                                circular.push([key, value, value[key]]);
                                value[key] = {
                                    '@r': value[key]['@c']
                                };
                            } else {
                                value[key] = JsonEx._encode(value[key], circular, depth + 1);

                                if (value[key] instanceof Array) {
                                    //wrap array
                                    circular.push([key, value, value[key]]);

                                    value[key] = {
                                        '@c': value[key]['@c'],
                                        '@a': value[key]
                                    };
                                }
                            }
                        } else {
                            value[key] = JsonEx._encode(value[key], circular, depth + 1);
                        }
                    }
                }
            }
            depth--;
            return value;
        },
        _decode: function (value, circular, registry) {
            var type = Object.prototype.toString.call(value);
            if (type === '[object Object]' || type === '[object Array]') {
                registry[value['@c']] = value;

                if (value['@']) {
                    var constructor = window[value['@']];
                    if (constructor) {
                        value = JsonEx._resetPrototype(value, constructor.prototype);
                    }
                }
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        if (value[key] && value[key]['@a']) {
                            //object is array wrapper
                            var body = value[key]['@a'];
                            body['@c'] = value[key]['@c'];
                            value[key] = body;
                        }
                        if (value[key] && value[key]['@r']) {
                            //object is reference
                            circular.push([key, value, value[key]['@r']])
                        }
                        value[key] = JsonEx._decode(value[key], circular, registry);
                    }
                }
            }
            return value;
        },
        _getConstructorName: function (value) {
            var name = value.constructor.name;
            if (name === undefined) {
                var func = /^\s*function\s*([A-Za-z0-9_$]*)/;
                name = func.exec(value.constructor)[1];
            }
            return name;
        },
        _resetPrototype: function (value, prototype) {
            if (Object.setPrototypeOf !== undefined) {
                Object.setPrototypeOf(value, prototype);
            } else if ('__proto__' in value) {
                value.__proto__ = prototype;
            } else {
                var newValue = Object.create(prototype);
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        newValue[key] = value[key];
                    }
                }
                value = newValue;
            }
            return value;
        },
        stringify: function (object) {
            var circular = [];
            JsonEx.id = 1;
            var json = JSON.stringify(JsonEx._encode(object, circular, 0));
            JsonEx._cleanMetadata(object);
            JsonEx._restoreCircularReference(circular);
            return json;
        },
        parse: function (json) {
            var circular = [];
            var registry = {};
            var contents = JsonEx._decode(JSON.parse(json), circular, registry);
            JsonEx._cleanMetadata(contents);
            JsonEx._linkCircularReference(contents, circular, registry);
            return contents;
        },
        makeDeepCopy: function (object) {
            return JsonEx.parse(JsonEx.stringify(object));
        }
    };
    return JsonEx;
};