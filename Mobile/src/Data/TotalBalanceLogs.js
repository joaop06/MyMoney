import CRUD from "./DataBase/CRUD";

class TotalBalanceLogs extends CRUD {
    constructor(tableName, tableNameAbbreviated) {
        super(tableName, tableNameAbbreviated)
        this.tableName = tableName;
        this.tableNameAbbreviated = tableNameAbbreviated;
    }

    async lastTotalBalance(userId) {
        try {
            const where = `
                WHERE 
                    userId = ${userId} 
                    AND dateRelease = (
                        SELECT 
                            MAX(dateRelease)
                        FROM 
                            TotalBalanceLogs
                        WHERE 
                            userId = ${userId}
                    );`
            const fields = 'id, userId, value, dateRelease'

            const totalBalance = await super.find(fields, where)
            const result = totalBalance?.rows?.length ? totalBalance?.rows.length : totalBalance?.rows[0].value

            console.log(result)
            return result

        } catch (e) {
            console.error('Erro ao buscar último Saldo Total: ', e)
        }
    }

    async historyTotalBalance(userId) {
        try {
            const history = await super.find('*', `WHERE userId = ${userId} ORDER BY `)

            return

        } catch (e) {
            console.error(e)
        }
    }
}

export default new TotalBalanceLogs('TotalBalanceLogs', 'TotalBalanceLogs tb');