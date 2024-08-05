import SQLite from './SQLite';
class DataBase extends SQLite {
    constructor() {
        super()
    }

    treatWhere(where) {

    }

    async find(tableName, where = {}) {
        try {
            let sqlWhere = []
            Object.keys(where).map(key => {
                const value = where[key]
                const typeValue = typeof value

                sqlWhere.push(`${key} = ${value}`)
            })
            const whereClause = sqlWhere.length > 0 ? `WHERE ${sqlWhere.join(' AND ')}` : ''

            const result = await super.executeQuery(`SELECT * FROM ${tableName} ${whereClause}`)

            return {
                rows: result.rows.raw(),
                totalCount: result.rows.length,
            }

        } catch (e) {
            throw e
        }
    }

    async create(tableName, object) {
        await super.executeQuery(`INSERT INTO Users (name, username, password) VALUES ('João Pedro', 'joaop', 'jp123')`)

    }

    async update(tableName, object, where = {}) {

    }

    async delete(tableName, id) {

    }
}

DataBase.init()
export default new DataBase();