import Releases from "./Releases";
import CRUD from "./DataBase/CRUD";

class Users extends CRUD {
    constructor(tableName) {
        super(tableName)
        this.tableName = tableName;
    }

    async create(object) {
        try {
            const findUsername = await super.find({ username: object.username })
            if (findUsername?.rows?.length > 0) {
                throw new Error('Usuário já cadastrado')
            }

            return await super.create(object)

        } catch (e) {
            console.error(e)
            throw e
        }
    }

    async verifyIsLoggedIn(username = '') {
        try {
            if (username === '') return false

            let user = await super.find({ username })
            user = user.rows[0]

            const tokenIsExpired = new Date(user?.tokenExpiresAt || new Date()) > new Date()

            return tokenIsExpired

        } catch (e) {
            console.error('Erro ao verificar usuário logado', e)
        }
    }

    async login(username, password) {
        let success = false
        let user = await super.find({ username, password })

        if (user.totalCount > 0) {
            user = user.rows[0]

            const now = new Date()
            now.setHours(now.getHours() + 3)
            const tokenExpiresAt = now.toISOString()

            await super.update({ tokenExpiresAt: `'${tokenExpiresAt}'` }, { id: user.id })

            success = true
            return { success, user }
        }

        return { success }
    }

    async updateTotalBalance(userId) {
        try {
            const releases = await Releases.find({ userId })

            let totalBalance = 0.00
            releases.rows.forEach(release => {
                if (release.type === 'RENTS') totalBalance += release.value
                else if (release.type === 'SPENDING') totalBalance -= release.value
            })

            await super.update({ totalBalance }, { id: userId })

            console.log(`Saldo Total atualizado: R$ ${totalBalance}`)

            return totalBalance

        } catch (e) {
            console.error('Erro ao atualizar Saldo Total', e)
        }
    }
}

export default new Users('Users');