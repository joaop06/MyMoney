import CRUD from "./DataBase/CRUD";

class Releases extends CRUD {
    constructor(tableName) {
        super(tableName)
        this.tableName = tableName;
    }
}

export default new Releases('Releases');