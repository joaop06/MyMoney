import { tables as Tables } from './TablesConfig.js';
import SQLiteStorage from 'react-native-sqlite-storage';

export default class SQLite {

    static get db() {
        return this._db
    }
    static set db(value) {
        this._db = value
    }

    static async init() {
        try {
            SQLite.db = SQLiteStorage.openDatabase(
                { name: 'mymoney.db', location: 'default' },
                () => console.log('Database opened successfully'),
                (error) => console.error('Error opening database', error)
            );

            const instance = new SQLite()
            if (false) {
                const tableNames = Tables.map(table => table.name)
                tableNames.forEach(async table => await instance.executeQuery(`DROP TABLE ${table}`))
                console.log('Tabelas Dropadas com sucesso!')
            }

            Tables.forEach(async table => {
                const { attributes } = table
                const attrs = Object.keys(attributes).map(attrName => {

                    const attribute = attributes[attrName]

                    let { primaryKey, autoIncrement, allowNull, defaultValue } = attribute

                    let sqlAttr = `${attrName} ${attribute.type}`

                    if (primaryKey) sqlAttr += ' PRIMARY KEY'
                    if (autoIncrement) sqlAttr += ' AUTOINCREMENT'


                    if (allowNull === false) sqlAttr += ' NOT NULL'
                    else sqlAttr += attribute.type === 'TEXT' ? '' : ' NULL'


                    if (defaultValue !== undefined) {
                        sqlAttr += typeof defaultValue === 'string' ? ` DEFAULT '${defaultValue}'` : ` DEFAULT ${defaultValue}`
                    }

                    return sqlAttr
                })

                let sql = `CREATE TABLE IF NOT EXISTS ${table.name} (${attrs.join(',')});`
                await instance.executeQuery(sql)
            })


            let userTest = await instance.executeQuery('SELECT * FROM Users WHERE username = "test"')
            if (userTest.rows.raw().length === 0) {
                await instance.executeQuery(`INSERT INTO Users (name, username, password) VALUES ('Usuário Teste', 'test', '1')`)
                console.log('Usuário Teste inserido')
            }

        } catch (e) {
            console.error(e)
        }
    }

    async executeQuery(sql) {
        return await new Promise((resolve, reject) => {
            SQLite.db.transaction(tx => {
                tx.executeSql(sql, [],
                    (transaction, resultSet) => {
                        resolve(resultSet)
                    },
                    (error) => reject(error))
            })
        })
    }
}
