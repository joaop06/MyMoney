import SQLite from './SQLite';
import { tables as Tables } from './TablesConfig.js';

export default class CRUD extends SQLite {
    constructor(tableName) {
        super(tableName)
        this.tableName = tableName
    }

    treatTableAttrsOnSql(object, options = {}) {
        const { joinWith, onlyValue } = options

        const sqlAttrs = []
        Object.keys(object).forEach(key => {
            const value = object[key]

            // Encontra Tabela manipulada
            const attrTable = Tables.find(table => table.name === this.tableName)
            const attributeInTable = attrTable?.attributes[key]

            if (attributeInTable) {
                if (onlyValue) {
                    sqlAttrs.push(attributeInTable.type === 'TEXT' ? `'${value}'` : value)

                } else {
                    sqlAttrs.push(attributeInTable.type === 'TEXT' ? `${key} = '${value}'` : `${key} = ${value}`)
                }
            }
        })

        if (joinWith) {
            return sqlAttrs.length > 0 ? `${sqlAttrs.join(joinWith)}` : ''

        } else {
            return sqlAttrs
        }
    }

    async find(where = {}) {
        try {
            const whereClause = this.treatTableAttrsOnSql(where, { joinWith: ' AND ' })
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
        const objectAttributes = Object.keys(object)
        const fieldsToCreate = this.treatTableAttrsOnSql(object, { joinWith: ',', onlyValue: true })

        const now = new Date().toISOString()
        return await super.executeQuery(`
            INSERT INTO ${this.tableName} (${objectAttributes},createdAt,updatedAt)
            VALUES (${fieldsToCreate},'${now}','${now}')
        `)
    }

    async update(object, where = {}) {
        const whereClause = this.treatTableAttrsOnSql(where, { joinWith: ' AND ' })
        const fieldsToUpdate = this.treatTableAttrsOnSql(object, { joinWith: ',' })
        if (fieldsToUpdate === '') return

        return await super.executeQuery(`
            UPDATE ${this.tableName}
            SET ${fieldsToUpdate}, updatedAt = '${new Date().toISOString()}'
            WHERE ${whereClause}
        `)
    }

    async delete(id) {
        return await super.executeQuery(`
            DELETE FROM ${this.tableName}
            WHERE id IN (${id})
        `)
    }
}

CRUD.init()
