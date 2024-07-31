import CreateTables from './SqlCreateTables';
import SQLite from 'react-native-sqlite-storage';


var instanceDb
class DataBase {
    constructor(SQLiteDb) {
        this.db = SQLiteDb
    }

    static async init() {
        try {
            const SQLiteDb = SQLite.openDatabase(
                { name: 'mymoney.db', location: 'default' },
                () => console.log('Database opened successfully'),
                (error) => console.log('Error opening database', error)
            );

            const instanceDb = new DataBase(SQLiteDb);
            CreateTables.forEach(async sql => await instanceDb.queries(sql))

        } catch (e) {
            console.error(e)
        }
    }

    async queries(sql) {
        this.db.transaction(tx => {
            const res = tx.executeSql(sql, [],
                (transaction, resultSet) => {
                    console.log('transaction', transaction);
                    console.log('resultSet', resultSet);
                },
                (error) => console.log('Error creating table', error)
            )
            console.log('res', res)
        })
    }
}

DataBase.init()
export default instanceDb;