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

    excludeKey<T>(from: Record<any, any>, key: string) {
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

        const keys = Array.from(Object.keys(obj)).sort((a, b) => {
            if (a === key) return -1;
            if (b === key) return 1;
            return 0;
        });

        for (let k of keys) {
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
        const copy = Object.assign({}, obj);

        const keys = Array.from(Object.keys(obj)).sort((a, b) => {
            for (let k of order) {
                if (a === k) return -1;
                if (b === k) return 1;
            }

            return 0;
        });

        for (let k of keys) {
            delete obj[k];
            obj[k] = copy[k];
        }

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
     * Walk through all the object property keys recursively and apply a transform to each key.
     * @param obj
     * @param fn
     */
    transformKeys(obj: any, fn: (key: string) => string) {
        if (!_obj.isObject(obj)) return obj;

        // const result = {};
        // const result = obj;
        const keys = Object.keys(obj);

        for (let oldKey of keys) {
            const value = obj[oldKey];
            const transformedKey = fn(oldKey);

            obj[transformedKey] = value;
            delete obj[oldKey];

            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    value[i] = this.transformKeys(value[i], fn);
                }
            } else if (_obj.isObject(value)) {
                obj[transformedKey] = this.transformKeys(value, fn);
            }
        }

        return obj;
    }
};
