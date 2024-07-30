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

                case 'object':
                    value = await this.storage.getArray(item);
                    break

                default:
                    throw new Error(`Unsupported type for attribute '${item}'`);
            }

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
            if (type !== attribute.type) throw new Error(`Invalid type from attribute '${key}`);

            switch (type) {
                case 'string':
                    await this.storage.setString(key, value);
                    break

                case 'boolean':
                    await this.storage.setBool(key, value);
                    break

                case 'number':
                    await this.storage.setInt(key, value);
                    break

                case 'object':

                    if (attribute.subType === 'array') {
                        await this.storage.setArray(key, value);
                    }
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

    static async updateTotalBalance() {
        try {
            const rents = await this.find('rents')
            const spending = await this.find('spending')

            let totalBalance = 0.00
            const allReleases = rents.concat(spending)

            allReleases.forEach(release => {
                if (release.type === 'rents') totalBalance += release.value
                else if (release.type === 'spending') totalBalance -= release.value
            })

            await this.set('totalBalance', totalBalance)
            console.log(`Saldo Total atualizado: R$ ${totalBalance}`)

            return totalBalance

        } catch (e) {
            console.error('Erro ao atualizar Saldo Total', e)
        }
    }
}

