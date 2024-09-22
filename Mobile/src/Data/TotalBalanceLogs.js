import moment from "moment";
import CRUD from "./DataBase/CRUD";

class TotalBalanceLogs extends CRUD {
    constructor(tableName, tableNameAbbreviated) {
        super(tableName, tableNameAbbreviated)
        this.tableName = tableName;
        this.tableNameAbbreviated = tableNameAbbreviated;
    }

    /**
     * Adicionar LOGs baseado no lançamento
     * 
     * Sempre que inserir, atualizar ou deletar um lançamento
     * deverá criar/atualizar o registro de logs com data de lançamento
     * ID usuário, ID lançamento, valor
     * 
     * Para que seja possível filtrar todos os LOGs de um mesmo mês e,
     * ordenados pela data de lançamento, será possível simular a ordem cronológica
     * dos lançamentos de rendas e despesas para encontrar o saldo total no último
     * dia do mês
     */



    async lastTotalBalance(userId) {
        try {
            const where = `
                WHERE 
                    userId = ${userId} 
                    AND createdAt = (
                        SELECT 
                            MAX(createdAt)
                        FROM 
                            TotalBalanceLogs
                        WHERE 
                            userId = ${userId}
                    );`
            const fields = 'id, userId, value, createdAt'

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
            if (!userId) throw new Error('Usuário não informado')

            // let history = await super.executeQuery(`
            //         SELECT 
            //             strftime('%m', tb.createdAt) as month,       -- Obtém o mês em formato numérico (01-12)
            //             strftime('%Y', tb.createdAt) as year,        -- Obtém o ano
            //             -- tb.createdAt as lastDate,                    -- Data mais recente para o mês/ano
            //             tb.value as balance                            -- Saldo correspondente à data mais recente
            //         FROM 
            //             TotalBalanceLogs tb
            //         INNER JOIN (
            //             SELECT 
            //                 userId,
            //                 MAX(createdAt) as maxCreatedAt,        -- Última data de lançamento para cada mês/ano
            //                 strftime('%m', createdAt) as month,
            //                 strftime('%Y', createdAt) as year
            //             FROM 
            //                 TotalBalanceLogs
            //             WHERE 
            //                 userId = ${userId}
            //             GROUP BY 
            //                 year, month
            //         ) sub ON 
            //             tb.userId = sub.userId AND 
            //             tb.createdAt = sub.maxCreatedAt            -- Junta com a tabela original pela data máxima
            //         WHERE 
            //             tb.userId = ${userId}
            //         ORDER BY 
            //             tb.createdAt DESC;                           -- Ordena pela data mais recente
            //     `);

            let history = await super.executeQuery(`
                WITH LatestBalanceLogs AS (
                    SELECT 
                        id,                                      -- Identificador único do registro
                        userId,
                        strftime('%m', dateRelease) AS month,    -- Mês de lançamento
                        strftime('%Y', dateRelease) AS year,     -- Ano de lançamento
                        MAX(createdAt) AS maxCreatedAt           -- Última data de inserção para o mês/ano
                    FROM 
                        TotalBalanceLogs
                    WHERE 
                        userId = ${userId}
                    GROUP BY 
                        userId, year, month                      -- Agrupa por usuário, ano e mês de lançamento
                )
                SELECT 
                    strftime('%m', tb.dateRelease) AS month,     -- Mês em formato numérico (01-12)
                    strftime('%Y', tb.dateRelease) AS year,      -- Ano
                    tb.value AS balance                          -- Saldo correspondente à data de inserção mais recente
                FROM 
                    TotalBalanceLogs tb
                INNER JOIN 
                    LatestBalanceLogs lbl ON tb.id = lbl.id      -- Junta com o registro que tem a maior data de inserção
                WHERE 
                    tb.userId = ${userId}
                ORDER BY 
                    tb.dateRelease DESC;                         -- Ordena pela data de lançamento mais recente
                `)

            const getLastDayOfTheMonth = (year, month) => {
                return moment(`${year}-${month}`, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
            }


            history = history.rows.raw().map(item => {
                item.lastDate = getLastDayOfTheMonth(item.year, item.month)
                return item
            });


            const months = [];
            const getCdiRate = async () => {
                // Obtenha a taxa de CDI de uma fonte confiável ou defina um valor estático
                return 0.12; // 12% ao ano, por exemplo
            };
            const capitalizeFirstLetter = (string) => {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };

            // Loop para pegar os 3 meses anteriores
            for (let i = 3; i > 0; i--) {
                const previousMonth = moment().subtract(i, 'months');
                const previousMonthNumber = previousMonth.month() + 1;
                let dataPreviousMonth = history.find(item => item.month == previousMonthNumber);

                if (!dataPreviousMonth) {
                    dataPreviousMonth = {
                        balance: 0.00,
                        year: `${previousMonth.year()}`

                    };
                }

                dataPreviousMonth.previousMonth = true;
                dataPreviousMonth.lastDate = getLastDayOfTheMonth(dataPreviousMonth.year, previousMonthNumber);
                dataPreviousMonth.month = { number: previousMonthNumber, name: capitalizeFirstLetter(previousMonth.format('MMM')) };

                months.push(dataPreviousMonth);
            }


            // Mês atual
            const currentMonth = moment();
            const currentMonthNumber = currentMonth.month() + 1;
            let dataCurrentMonth = history.find(item => item.month == currentMonthNumber)

            if (!dataCurrentMonth) {
                dataCurrentMonth = {
                    balance: 0.00,
                    year: `${currentMonth.year()}`
                }
            }

            dataCurrentMonth.currentMonth = true
            dataCurrentMonth.lastDate = getLastDayOfTheMonth(dataCurrentMonth.year, currentMonthNumber);
            dataCurrentMonth.month = { number: currentMonthNumber, name: capitalizeFirstLetter(currentMonth.format('MMM')) }

            months.push(dataCurrentMonth);


            // Calcular a previsão de saldo para os 3 meses seguintes
            let nextBalance = dataCurrentMonth.balance
            const cdiRate = await getCdiRate();
            for (let i = 1; i <= 3; i++) {
                const nextMonth = moment().add(i, 'months');
                const nextMonthNumber = nextMonth.month() + 1;

                let dataNextMonth = history.find(item => item.month == nextMonthNumber) || { ...dataCurrentMonth }
                dataNextMonth = {
                    nextMonth: true,
                    ...dataNextMonth,
                    lastDate: getLastDayOfTheMonth(nextMonth.year(), nextMonthNumber),
                    month: { number: nextMonthNumber, name: capitalizeFirstLetter(nextMonth.format('MMM')) },
                };

                // Previsão de rendimento do CDI para o mês atual
                if (nextBalance > 0) {
                    nextBalance += nextBalance * (cdiRate / 12);
                    dataNextMonth.balance = nextBalance
                }

                delete dataNextMonth.currentMonth;
                months.push(dataNextMonth);
            }

            months.forEach(item => console.log(item));
            return months;

        } catch (e) {
            console.error(e)
        }
    }
}

export default new TotalBalanceLogs('TotalBalanceLogs', 'TotalBalanceLogs tb');