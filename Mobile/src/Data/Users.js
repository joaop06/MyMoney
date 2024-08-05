import CRUD from "./DataBase/CRUD";

class Users extends CRUD {
    constructor(tableName) {
        super(tableName)
        this.tableName = tableName;
    }

    async verifyIsLoggedIn(username = '') {
        try {
            if (username === '') return false

            let user = await super.find({ username })
            user = user.rows[0]

            const tokenIsExpired = new Date(user.tokenExpiresAt || new Date()) > new Date()

            return tokenIsExpired

        } catch (e) {
            console.error(e)
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
}

export default new Users('Users');