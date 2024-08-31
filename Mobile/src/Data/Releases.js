import CRUD from "./DataBase/CRUD";

class Releases extends CRUD {
    constructor(tableName, tableNameAbbreviated) {
        super(tableName, tableNameAbbreviated)
        this.tableName = tableName;
        this.tableNameAbbreviated = tableNameAbbreviated;
    }
}

export default new Releases('Releases', 'Releases r');