import CRUD from "./DataBase/CRUD";

class Categories extends CRUD {
    constructor(tableName) {
        super(tableName)
        this.tableName = tableName;
    }
}

export default new Categories('Categories');