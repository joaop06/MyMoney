import moment from "moment";
import SQLite from './SQLite';
import { tables as Tables } from './TablesConfig.js';

export default class CRUD extends SQLite {
    constructor(tableName, tableNameAbbreviated) {
        super(tableName, tableNameAbbreviated)
        this.tableName = tableName;
        this.tableNameAbbreviated = tableNameAbbreviated;
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
                    sqlAttrs.push(['TEXT', 'DATETIME'].includes(attributeInTable.type) ? `"${`${value}`.replaceAll('\"', '\'')}"` : value)

                } else {
                    sqlAttrs.push(['TEXT', 'DATETIME'].includes(attributeInTable.type) ? `${key} = "${`${value}`.replaceAll('\"', '\'')}"` : `${key} = ${value}`)
                }
            }
        })

        if (joinWith) {
            return sqlAttrs.length > 0 ? `${sqlAttrs.join(joinWith)}` : ''

        } else {
            return sqlAttrs
        }
    }

    async find(fields = '*', where, include) {
        try {
            let sqlSelect
            if (where && include) {
                sqlSelect = `SELECT ${fields} FROM ${this.tableNameAbbreviated} ${include} ${where}`

            } else if (include) {
                sqlSelect = `SELECT ${fields} FROM ${this.tableNameAbbreviated} ${include}`

            } else if (where) {
                sqlSelect = `SELECT ${fields} FROM ${this.tableNameAbbreviated} ${where}`

            } else {
                sqlSelect = `SELECT ${fields} FROM ${this.tableNameAbbreviated}`
            }


            const result = await super.executeQuery(sqlSelect)

            return {
                rows: result.rows.raw(),
                totalCount: result.rows.length,
            }

        } catch (e) {
            throw e
        }
    }

    async create(fields, values) {
        const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        const sqlCreate = `INSERT INTO ${this.tableName} (${fields}, createdAt, updatedAt) VALUES (${values}, '${now}', '${now}')`

        return await super.executeQuery(sqlCreate)
    }

    async update(fields, where) {
        if (!fields || !where) throw new Error('Campos ou Condições não informadas')

        const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        const sqlUpdate = `UPDATE ${this.tableName} SET ${fields}, updatedAt = '${now}' ${where}`

        return await super.executeQuery(sqlUpdate)
    }

    async delete(id) {
        return await super.executeQuery(`
            DELETE FROM ${this.tableName}
            WHERE id IN (${id})
        `)
    }
}

CRUD.init()
