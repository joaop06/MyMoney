import RNFS from 'react-native-fs';
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
            const instance = new SQLite();

            SQLite.db = SQLiteStorage.openDatabase(
                { name: 'mymoney.db', location: 'default' },
                () => console.log('Database opened successfully'),
                (error) => console.error('Error opening database', error)
            );


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


            /**
             * Executa as Migrações do Banco (Alterações nas tabelas)
             */
            setTimeout(async () => {
                const migrations = require('./MigrationsSql.js')
                for (const migration of migrations) {
                    await instance.executeQuery(migration)
                        .catch(err => err);
                }
            }, 1000)


            /**
             * Insere Primeiros registros (Usuário teste e Categorias)
             */
            setTimeout(async () => {
                let userTest = await instance.executeQuery('SELECT * FROM Users WHERE username = "test"')
                if (userTest.rows.raw().length === 0) {
                    await instance.executeQuery(`INSERT INTO Users (name, username, password) VALUES ('Usuário Teste', 'test', '1')`)
                    console.log('Usuário Teste inserido')
                }

                const categories = await instance.executeQuery('SELECT * FROM Categories')
                if (categories.rows.raw().length === 0) {
                    await instance.executeQuery(`
                        INSERT INTO Categories (type, name, label, icon, color)
                        VALUES
                        ('SPENDING', 'health', 'Saúde', 'heart-pulse', '#E53935'),
                        ('SPENDING', 'leisure', 'Lazer', 'pinwheel-outline', '#1E88E5'),
                        ('SPENDING', 'home', 'Casa', 'home-outline', '#43A047'),
                        ('SPENDING', 'meals', 'Refeições', 'silverware-variant', '#FB8C00'),
                        ('SPENDING', 'education', 'Educação', 'school-outline', '#8E24AA'),
                        ('SPENDING', 'gifts', 'Presentes', 'gift-outline', '#D81B60'),
                        ('SPENDING', 'transportation', 'Transporte', 'taxi', '#FDD835'),
                        ('SPENDING', 'others', 'Outros', 'help-circle-outline', '#757575'),
                        ('RENTS', 'salary', 'Salário', 'cash-multiple', '#43A047'),
                        ('RENTS', 'freelance', 'Freelance', 'account-cash-outline', '#1E88E5'),
                        ('RENTS', 'investments', 'Investimentos', 'chart-areaspline', '#8E24AA'),
                        ('RENTS', 'rent', 'Aluguel', 'home-city-outline', '#FDD835'),
                        ('RENTS', 'sales', 'Vendas', 'cash-register', '#FB8C00'),
                        ('RENTS', 'gifts', 'Presentes', 'gift-open-outline', '#D81B60'),
                        ('RENTS', 'awards', 'Prêmios', 'trophy-variant-outline', '#FFD700'),
                        ('RENTS', 'others', 'Outros', 'help-circle-outline', '#757575')
                    `)
                    console.log('Categorias Inseridas')
                }
            }, 2000);

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
