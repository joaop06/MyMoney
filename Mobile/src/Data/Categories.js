import CRUD from "./DataBase/CRUD";

class Categories extends CRUD {
    constructor(tableName, tableNameAbbreviated) {
        super(tableName, tableNameAbbreviated)
        this.tableName = tableName;
        this.tableNameAbbreviated = tableNameAbbreviated;
    }
}

export default new Categories('Categories', 'Categories c');