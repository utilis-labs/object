import { describe, expect, test } from 'vitest';
import { _obj } from './index.js';

describe('_obj', () => {
    test('_obj.merge', () => {
        const ob1 = {
            firstName: 'John',
            lastName: 'Smith'
        };

        const ob2 = {
            age: 40,
            occupation: 'Worker'
        };

        _obj.merge(ob1, ob2);

        expect(ob1).toHaveProperty('age');
        expect(ob1).toHaveProperty('occupation');
    });

    test('_obj.exclude', () => {
        const ob1 = {
            a: 'A',
            b: 'B',
            c: 'C',
            d: 'D'
        };

        const blacklist = {
            b: 'B',
            d: 'D'
        };

        _obj.exclude(ob1, blacklist);

        expect(Object.keys(ob1).includes('b')).toBeFalsy();
        expect(Object.keys(ob1).includes('d')).toBeFalsy();
    });

    test('_obj.excludeKey', () => {
        const ob = {
            a: 'A',
            b: 'B',
            c: 'C',
            d: 'D'
        };

        _obj.excludeKey(ob, 'c');

        const keys = Object.keys(ob);
        expect(keys.includes('c')).toBe(false);
    });

    test('_obj.insertFirst', () => {
        const ob = {
            a: 'A',
            b: 'B'
        };

        _obj.insertFirst(ob, 'foo', 'boo');

        expect(ob).toHaveProperty('foo');
        expect(ob['foo']).toEqual('boo');
    });

    test('_obj.hasProp', () => {
        const ob = {
            a: 'A',
            b: 'B'
        };

        const res = _obj.hasProp(ob, 'a');
        expect(res).toBe(true);
    });

    test('_obj.isEmpty', () => {
        const ob = {
            a: 'A'
        };

        const ob2 = {};

        expect(_obj.isEmpty(ob)).toBe(false);
        expect(_obj.isEmpty(ob2)).toBe(true);

        expect(_obj.isEmpty({})).toBe(true);
        expect(_obj.isEmpty({ a: 1 })).toBe(false);
        expect(_obj.isEmpty(null)).toBe(true);
        expect(_obj.isEmpty(undefined)).toBe(true);
    });

    test('_obj.isObject', () => {
        const ob = {
            a: 'A'
        };

        const ob2 = ['a', 'b'];

        expect(_obj.isObject(ob)).toBe(true);
        expect(_obj.isObject(ob2)).toBe(false);

        expect(_obj.isObject({})).toBe(true);
        expect(_obj.isObject([])).toBe(false);
        expect(_obj.isObject(123)).toBe(false);
        expect(_obj.isObject(null)).toBe(false);
        expect(_obj.isObject(undefined)).toBe(false);
    });

    test('_obj.setFirstKey', () => {
        const ob = {
            a: 'A',
            b: 'B',
            c: 'C'
        };

        const result = _obj.setFirstKey(ob, 'c');
        const resultKeys = Object.keys(result);
        expect(resultKeys[0]).toEqual('c');
    });

    test('_obj.reorderKeys', () => {
        const ob = {
            a: 'A',
            b: 'B',
            c: 'C',
            d: 'D'
        };

        const order1 = ['d', 'b', 'a', 'c'];
        _obj.reorderKeys(ob, order1);
        expect(Object.keys(ob)).toEqual(order1);

        const order2 = ['a'];
        _obj.reorderKeys(ob, order2);
        expect(Object.keys(ob)).toEqual(Object.keys(ob))
    });

    test('_obj.initializeNumberValue', () => {
        const ob = {};
        const key = 'k';
        _obj.initializeNumberValue(ob, key);

        let type = typeof ob[key];
        expect(type).toEqual('number');
        expect(ob[key]).not.toBeUndefined();
    });

    test('_obj.initializeStringValue', () => {
        const ob = {};
        const key = 'k';
        _obj.initializeStringValue(ob, key);

        let type = typeof ob[key];
        expect(type).toEqual('string');
        expect(ob[key]).not.toBeUndefined();
    });

    test('_obj.initializeObjectValue', () => {
        const ob = {};
        const key = 'k';
        _obj.initializeObjectValue(ob, key);

        let type = typeof ob[key];
        expect(type).toEqual('object');
        expect(ob[key]).not.toBeUndefined();
    });

    test('_obj.initializeSetValue', () => {
        const ob = {};
        const key = 'k';
        _obj.initializeSetValue(ob, key);

        let type = typeof ob[key];
        expect(ob[key]).not.toBeUndefined();
        expect(type).toEqual(typeof new Set());
        expect(ob[key].constructor).toEqual(Set);
    });

    test('_obj.initializeArrayValue', () => {
        const ob = {};
        const key = 'k';
        _obj.initializeArrayValue(ob, key);

        // let type = typeof ob[key];
        expect(ob[key]).not.toBeUndefined();
        expect(Array.isArray(ob[key])).toBe(true);
    });

    test('_obj.transformKeys', () => {
        const ob = {
            name: 'john',
            car: {
                maker: 'Toyota',
                year: 2020
            },
            kids: [
                'fiona',
                'james',
                {
                    food: 'fish'
                },
                'helen'
            ]
        };

        _obj.transformKeys(ob, (k) => {
            return k.charAt(0).toUpperCase() + k.slice(1);
        });

        console.log('-> ob.Kids', ob['Kids']);

        expect(ob['name']).toBeUndefined();
        expect(ob['Name']).toEqual('john');
        expect(ob['car']).toBeUndefined();
        expect(ob['kids']).toBeUndefined();
        expect(ob['Kids']).toBeDefined();

        let item = ob['Kids'][2];
        expect(item['food']).toBeUndefined();
        expect(item['Food']).toEqual('fish');
    });

    test('_obj.transformValues', () => {
        const ob = {
            name: 'john',
            car: {
                maker: 'Toyota',
                year: 2020
            },
            kids: [
                'fiona',
                'james',
                {
                    food: 'fish'
                },
                'helen'
            ]
        };

        _obj.transformValues(ob, (v) => {
            if (typeof v === 'string') {
                return v.toUpperCase();
            }
            return v;
        });

        let testValue = ob['name'];
        expect(testValue).toEqual('JOHN');
        expect(testValue).not.toEqual('John');
        expect(ob.car.maker).toEqual('TOYOTA');
        expect(ob.kids.includes('fiona')).toBe(false);
        expect(ob.kids.includes('FIONA')).toBe(true);

        let item = ob['kids'][2];
        expect(item['food']).toEqual('FISH');
    });
});
