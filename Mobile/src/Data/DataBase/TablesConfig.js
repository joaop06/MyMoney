import moment from "moment";

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
                totalBalance: {
                    type: 'REAL',
                    allowNull: true,
                    defaultValue: 0.00,
                },
                tokenExpiresAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: new Date().toISOString()
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: new Date().toISOString()
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
                value: {
                    type: 'REAL',
                    allowNull: true,
                },
                title: {
                    type: 'TEXT',
                    allowNull: true,
                },
                userId: {
                    type: 'INTEGER',
                    allowNull: false,
                },
                description: {
                    type: 'TEXT',
                    allowNull: true,
                },
                type: {
                    type: 'TEXT',
                    allowNull: true,
                },
                dateRelease: {
                    type: 'DATETIME',
                    allowNull: true,
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                },
            }
        },
        {
            name: 'Categories',
            attributes: {
                id: {
                    type: 'INTEGER',
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: 'TEXT',
                    allowNull: false,
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: new Date().toISOString()
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
                    defaultValue: new Date().toISOString()
                },
            }
        }
    ]
}
