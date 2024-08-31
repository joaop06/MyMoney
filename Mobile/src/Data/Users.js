import moment from "moment";
import Releases from "./Releases";
import CRUD from "./DataBase/CRUD";

class Users extends CRUD {
    constructor(tableName, tableNameAbbreviated) {
        super(tableName, tableNameAbbreviated)
        this.tableName = tableName;
        this.tableNameAbbreviated = tableNameAbbreviated;
    }

    async create(username, object) {
        try {
            const findUsername = await super.find('*', `WHERE u.username = '${username}'`)
            if (findUsername?.rows?.length > 0) {
                throw new Error('Usuário já cadastrado')
            }

            const { fields, values } = object
            return await super.create(fields, values)

        } catch (e) {
            console.error(e)
            throw e
        }
    }

    async verifyIsLoggedIn(username = '') {
        try {
            if (username === '') return false

            let user = await super.find('*', `WHERE u.username = '${username}'`)
            user = user?.rows[0]

            const tokenIsExpired = moment(user?.tokenExpiresAt || moment()) > moment()

            return { firstNameUser: user?.name, tokenIsExpired }

        } catch (e) {
            console.error('Erro ao verificar usuário logado', e)
        }
    }

    async login(username, password) {
        let success = false
        let user = await super.find('*', `WHERE u.username = '${username}' AND u.password = '${password}'`)

        if (user.totalCount > 0) {
            user = user.rows[0]

            const now = moment()
            now.add(now.days() + 1, 'days')
            const tokenExpiresAt = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')


            const where = `WHERE id = ${user.id}`
            const fields = `tokenExpiresAt='${tokenExpiresAt}'`

            await super.update(fields, where)

            success = true
            return { success, user }
        } else {
            throw new Error('Usuário não encontrado')
        }
    }

    async updateTotalBalance(userId) {
        try {
            const releases = await Releases.find('*', `WHERE r.userId = ${userId}`)

            let totalBalance = 0.00
            releases.rows.forEach(release => {
                if (release.type === 'RENTS') totalBalance += release.value
                else if (release.type === 'SPENDING') totalBalance -= release.value
            })


            const where = `WHERE id = ${userId}`
            const fields = `totalBalance=${totalBalance}`

            await super.update(fields, where)

            return totalBalance

        } catch (e) {
            console.error('Erro ao atualizar Saldo Total', e)
        }
    }
}

export default new Users('Users', 'Users u');