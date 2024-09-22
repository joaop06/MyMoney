import CRUD from "./DataBase/CRUD";
import TotalBalanceLogs from "./TotalBalanceLogs";

class Releases extends CRUD {
    constructor(tableName, tableNameAbbreviated) {
        super(tableName, tableNameAbbreviated)
        this.tableName = tableName;
        this.tableNameAbbreviated = tableNameAbbreviated;
    }

    async create(fields, values) {
        try {

            const result = await super.create(fields, values)

            await TotalBalanceLogs.create()

        } catch (e) {
            throw e
        }
    }
}

export default new Releases('Releases', 'Releases r');