import moment from "moment";
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

            if (false) {
                await instance.executeQuery('DROP TABLE Users')
                await instance.executeQuery('DROP TABLE Releases')
                await instance.executeQuery('DROP TABLE Categories')
                await instance.executeQuery('DROP TABLE TotalBalanceLogs')
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
                    try {
                        const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

                        await instance.executeQuery(`
                            INSERT INTO Categories (typeRelease, name, label, icon, color, createdAt, updatedAt)
                            VALUES
                            ('SPENDING', 'health', 'Saúde', 'heart-pulse', '#E53935', '${now}', '${now}'),
                            ('SPENDING', 'leisure', 'Lazer', 'pinwheel-outline', '#1E88E5', '${now}', '${now}'),
                            ('SPENDING', 'home', 'Casa', 'home-outline', '#43A047', '${now}', '${now}'),
                            ('SPENDING', 'meals', 'Refeições', 'silverware-variant', '#FB8C00', '${now}', '${now}'),
                            ('SPENDING', 'education', 'Educação', 'school-outline', '#8E24AA', '${now}', '${now}'),
                            ('SPENDING', 'gifts', 'Presentes', 'gift-outline', '#D81B60', '${now}', '${now}'),
                            ('SPENDING', 'transportation', 'Transporte', 'taxi', '#FDD835', '${now}', '${now}'),
                            ('SPENDING', 'others', 'Outros', 'help-circle-outline', '#757575', '${now}', '${now}'),
                            ('RENTS', 'salary', 'Salário', 'cash-multiple', '#43A047', '${now}', '${now}'),
                            ('RENTS', 'freelance', 'Freelance', 'account-cash-outline', '#1E88E5', '${now}', '${now}'),
                            ('RENTS', 'investments', 'Investimentos', 'chart-areaspline', '#8E24AA', '${now}', '${now}'),
                            ('RENTS', 'rent', 'Aluguel', 'home-city-outline', '#FDD835', '${now}', '${now}'),
                            ('RENTS', 'sales', 'Vendas', 'cash-register', '#FB8C00', '${now}', '${now}'),
                            ('RENTS', 'gifts', 'Presentes', 'gift-open-outline', '#D81B60', '${now}', '${now}'),
                            ('RENTS', 'awards', 'Prêmios', 'trophy-variant-outline', '#FFD700', '${now}', '${now}'),
                            ('RENTS', 'others', 'Outros', 'help-circle-outline', '#757575', '${now}', '${now}')
                        `)
                        console.log('Categorias Inseridas')
                    } catch (e) {
                        console.error('Aconteceu alguma coisa ao inserir catagorias: ', e)
                    }
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
