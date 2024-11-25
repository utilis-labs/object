export const _obj = {
    merge<T>(target: Record<any, any>, source?: T) {
        if (!source) return target;
        Object.keys(source).forEach((key) => {
            target[key] = source[key];
        });
        return target;
    },

    exclude<T>(from: Record<any, any>, data?: T) {
        if (!data) return from;
        Object.keys(data).forEach((key) => {
            delete from[key];
        });
        return from;
    },

    excludeKey(from: Record<any, any>, key: string) {
        if (!key) return from;
        delete from[key];
        return from;
    },

    insertFirst(target: Record<any, any>, key: string, value: any) {
        const temp = {
            [key]: value,
            ...target
        };
        Object.keys(temp).forEach((k) => {
            delete target[k];
            target[k] = temp[k];
        });
    },

    hasProp(obj: Record<any, any>, prop: string): boolean {
        return Object.keys(obj).includes(prop);
    },

    isEmpty(obj: any): boolean {
        return !obj || Object.keys(obj).length === 0;
    },

    isObject(o: unknown): boolean {
        if (!o) return false;
        return Object.getPrototypeOf({}) == Object.getPrototypeOf(o) && !Array.isArray(o) && typeof o == 'object';
    },

    /**
     * Set an object key to be the first in the order of keys.
     * @param obj
     * @param key
     * @returns A new transformed object
     */
    setFirstKey(obj: any, key: string): any {
        let copy = Object.assign({}, obj);

        let obKeys = Object.keys(obj);

        for (let i = 0; i < obKeys.length; i++) {
            let k = obKeys[i];

            if (k === key) {
                delete obKeys[i];
                obKeys.unshift(key);
                break;
            }
        }

        for (let k of obKeys) {
            delete obj[k];
            obj[k] = copy[k];
        }

        copy = null;

        return obj;
    },

    /**
     * Change the order of keys in an object. Does not work recursively.
     * @param obj
     * @param order
     * @returns A new transformed object.
     */
    reorderKeys(obj: any, order: string[]): any {
        let copy = Object.assign({}, obj);
        Object.keys(obj);

        const orderSet: Set<string> = new Set(order);

        for (let k of orderSet) {
            delete obj[k];
            obj[k] = copy[k];
        }

        copy = null;

        return obj;
    },

    initializeNumberValue(obj: any, key: string) {
        if (typeof obj[key] == 'undefined') {
            obj[key] = 0;
        }
    },

    initializeStringValue(obj: any, key: string) {
        if (typeof obj[key] == 'undefined') {
            obj[key] = '';
        }
    },

    initializeObjectValue(obj: any, key: string) {
        if (typeof obj[key] == 'undefined') {
            obj[key] = {};
        }
    },

    initializeSetValue(obj: any, key: string) {
        if (typeof obj[key] == 'undefined') {
            obj[key] = new Set();
        }
    },

    initializeArrayValue(obj: any, key: string) {
        if (typeof obj[key] == 'undefined') {
            obj[key] = [];
        }
    },

    /**
     * Walk through all the object property keys and apply a transform to each key.
     * @param obj
     * @param fn
     */
    transformKeys(obj: Record<any, any>, fn: (key: string) => string) {
        if (!_obj.isObject(obj)) return obj;

        const keys = Object.keys(obj);

        for (let oldKey of keys) {
            const val = obj[oldKey];
            const transformedKey = fn(oldKey);

            obj[transformedKey] = val;
            delete obj[oldKey];

            if (Array.isArray(val)) {
                for (let i = 0; i < val.length; i++) {
                    if (_obj.isObject(val[i])) {
                        val[i] = this.transformKeys(val[i], fn);
                    }
                }
            } else if (_obj.isObject(val)) {
                obj[transformedKey] = this.transformKeys(val, fn);
            }
        }

        return obj;
    },

    /**
     * Walk through all the object property values and apply a transform to each value.
     *
     * @param obj
     * @param fn
     */
    transformValues(obj: Record<any, any>, fn: (value: any) => any) {
        if (!_obj.isObject(obj)) return obj;

        const keys: any[] = Object.keys(obj);

        for (let key of keys) {
            const val = obj[key];

            if (_obj.isObject(val)) {
                _obj.transformValues(val, fn);
            } else if (Array.isArray(val)) {
                for (let i = 0; i < val.length; i++) {
                    if (_obj.isObject(val[i])) {
                        val[i] = _obj.transformValues(val[i], fn);
                    } else {
                        val[i] = fn(val[i]);
                    }
                }
            } else {
                obj[key] = fn(val);
            }
        }

        return obj;
    },

    /**
     * Return object containing only entries of the specified keys.
     * @param ob
     * @param keys
     */
    pick<T extends Record<string, any>>(ob: T, keys: Array<keyof T>): Partial<T> {
        const propKeys = Object.keys(ob) as Array<keyof T>;
        const res: Partial<T> = {};

        for (const prop of propKeys) {
            if (keys.includes(prop)) {
                res[prop] = ob[prop];
            }
        }

        return res;
    },

    /**
     * Return object containing only entries that are not among the specified keys.
     * @param ob
     * @param keys
     */
    skip<T extends Record<string, any>>(ob: T, keys: Array<keyof T>): Partial<T> {
        const propKeys = Object.keys(ob) as Array<keyof T>;
        const res: Partial<T> = {};

        for (const prop of propKeys) {
            if (!keys.includes(prop)) {
                res[prop] = ob[prop];
            }
        }

        return res;
    },

    copy<T = any>(ob: T) {
        return Object.assign({}, ob) as T;
    },

    /**
     * Set an object property
     * @param ob
     * @param key
     * @param value
     */
    set<T>(ob: T, key: string, value: any) {
        ob[key] = value;
        return ob;
    },

    toJson(ob: any, spaces: number = 2) {
        return JSON.stringify(ob, null, spaces);
    }
};
