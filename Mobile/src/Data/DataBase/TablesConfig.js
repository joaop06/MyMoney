module.exports = {
    mapAttriburesType: {
        'string': ['TEXT'],
        'number': ['INTEGER', 'REAL'],
        'boolean': ['BOOLEAN'],
        'object': ['DATETIME'],
    },
    tables: [
        {
            name: 'Users',
            attributes: {
                id: {
                    type: 'INTEGER',
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                totalBalance: {
                    type: 'REAL',
                    allowNull: true,
                    defaultValue: 0.00,
                },
                name: {
                    type: 'TEXT',
                    allowNull: true,
                },
                username: {
                    type: 'TEXT',
                    allowNull: true,
                },
                password: {
                    type: 'TEXT',
                    allowNull: true,
                },
                isLoggedIn: {
                    allowNull: true,
                    type: 'BOOLEAN',
                    defaultValue: false,
                },
                tokenExpiresAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
                accessToken: {
                    type: 'TEXT',
                    allowNull: true,
                },
                refreshToken: {
                    type: 'TEXT',
                    allowNull: true,
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: 'CURRENT_TIMESTAMP'
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: 'CURRENT_TIMESTAMP'
                },
            }
        },
        {
            name: 'Releases',
            attributes: {
                id: {
                    type: 'INTEGER',
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                userId: {
                    type: 'INTEGER',
                    allowNull: false,
                },
                value: {
                    type: 'REAL',
                    allowNull: true,
                },
                title: {
                    type: 'TEXT',
                    allowNull: true,
                },
                description: {
                    type: 'TEXT',
                    allowNull: true,
                },
                type: {
                    type: 'TEXT',
                    allowNull: true,
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: 'CURRENT_TIMESTAMP'
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: 'CURRENT_TIMESTAMP'
                },
            }
        }
    ]
}
