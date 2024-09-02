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
                },
                tokenExpiresAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
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
                categoryId: {
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
                dateRelease: {
                    type: 'DATE',
                    allowNull: true,
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
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
                typeRelease: {
                    type: 'TEXT',
                    allowNull: false,
                },
                name: {
                    type: 'TEXT',
                    allowNull: false,
                },
                label: {
                    type: 'TEXT',
                    allowNull: false,
                },
                icon: {
                    type: 'TEXT',
                    allowNull: false,
                },
                color: {
                    type: 'TEXT',
                    allowNull: false,
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
            }
        },
        {
            name: 'TotalBalanceLogs',
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
                dateRelease: {
                    type: 'DATE',
                    allowNull: true,
                },
                createdAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
                updatedAt: {
                    allowNull: true,
                    type: 'DATETIME',
                },
            }
        }
    ]
}
