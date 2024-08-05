import TablesConfig from './TablesConfig';
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
            if (process.env.HOMOLOGATION == 'true') {
                console.log('Ambiente de homologação')
            }

            SQLite.db = SQLiteStorage.openDatabase(
                { name: 'mymoney.db', location: 'default' },
                () => console.log('Database opened successfully'),
                (error) => console.error('Error opening database', error)
            );


            const instance = new SQLite()
            TablesConfig.forEach(async table => {
                const { configAttributes } = table
                const attrs = Object.keys(configAttributes).map(attrName => {

                    const attribute = configAttributes[attrName]

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

module.exports = SQLite;