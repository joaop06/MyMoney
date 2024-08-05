import SQLite from './SQLite';
import { tables as Tables } from './TablesConfig.js';

export default class CRUD extends SQLite {
    constructor(tableName) {
        super(tableName)
        this.tableName = tableName
    }

    treatTableAttrsOnSql(object) {
        let sqlAttrs = Object.keys(object).map(key => {
            const value = object[key]
            const typeValue = typeof value

            // Encontra Tabela manipulada
            const attrTable = Tables.find(table => table.name === this.tableName)
            const attributeInTable = attrTable?.attributes[key]

            if (attributeInTable) {
                return attributeInTable.type === 'TEXT' ? `${key} = '${value}'` : `${key} = ${value}`
            }
        })

        return sqlAttrs.length > 0 ? `${sqlAttrs.join(' AND ')}` : ''
    }

    async find(where = {}) {
        try {
            const whereClause = this.treatTableAttrsOnSql(where)
            const result = await super.executeQuery(`SELECT * FROM ${this.tableName} WHERE ${whereClause}`)

            return {
                rows: result.rows.raw(),
                totalCount: result.rows.length,
            }

        } catch (e) {
            throw e
        }
    }

    async create(object) {
        await super.executeQuery(`INSERT INTO Users (name, username, password) VALUES ('João Pedro', 'joaop', 'jp123')`)

    }

    async update(object, where = {}) {
        const whereClause = this.treatTableAttrsOnSql(where)
        const fieldsToUpdate = this.treatTableAttrsOnSql(object)

        if (fieldsToUpdate === '') return

        return await super.executeQuery(`UPDATE ${this.tableName} SET ${fieldsToUpdate} WHERE ${whereClause}`)
    }

    async delete(id) {

    }
}

CRUD.init()