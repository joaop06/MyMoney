import Attributes from './Attributes';
import { MMKVLoader } from 'react-native-mmkv-storage';

export default class MMKV {
    constructor() {
        throw new Error("The MMKV class cannot be instantiated")
    }

    static _storage;
    static get storage() {
        if (!this._storage) this.init()
        return this._storage
    }

    static async init() {
        this._storage = new MMKVLoader().initialize();
        const attributesName = Object.keys(Attributes);

        for (const attrName of attributesName) {
            if (false) await this.remove(attrName)

            const isStarting = true
            const { value, attribute } = await this.find(attrName, isStarting);

            if ([null, undefined].includes(value) && value !== attribute.defaultValue) {
                await this.set(attrName, attribute.defaultValue, isStarting);
            }
        }
    }

    static async find(item, isStarting) {
        try {
            const attribute = Attributes[item];
            if (!attribute) throw new Error(`Unknown attribute '${item}`);

            let value
            switch (attribute.type) {
                case 'string':
                    value = await this.storage.getString(item);
                    break

                case 'boolean':
                    value = await this.storage.getBool(item);
                    break

                case 'number':
                    value = await this.storage.getInt(item);
                    break

                default:
                    throw new Error(`Unsupported type for attribute '${item}'`);
            }
            if (item === 'userData') value = JSON.parse(value)

            return isStarting ? { value, attribute } : value

        } catch (e) {
            console.error(`Erro ao buscar ${item}`, e);
        }
    }

    static async set(key, value) {
        try {
            const attribute = Attributes[key];
            if (!attribute) throw new Error(`Unknown attribute '${key}'`);

            const type = typeof value
            switch (type) {
                case 'string':
                    if (key === 'userData') {
                        await this.storage.setString(key, JSON.stringify(value));

                    } else {
                        await this.storage.setString(key, value);
                    }
                    break

                case 'boolean':
                    await this.storage.setBool(key, value);
                    break

                case 'number':
                    await this.storage.setInt(key, value);
                    break
            }

        } catch (e) {
            console.error(`Erro ao definir ${key}`, e);
        }
    }

    static async remove(item) {
        try {
            const attribute = Attributes[item];
            if (!attribute) throw new Error(`Unknown attribute '${item}'`);

            await this.storage.removeItem(item);

        } catch (e) {
            console.error(e);
        }
    }
}

