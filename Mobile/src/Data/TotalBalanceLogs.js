import moment from "moment";
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
            if (!userId) throw new Error('Usuário não informado')

            let history = await super.executeQuery(`
                    SELECT 
                        strftime('%m', tb.dateRelease) as month,       -- Obtém o mês em formato numérico (01-12)
                        strftime('%Y', tb.dateRelease) as year,        -- Obtém o ano
                        -- tb.dateRelease as lastDate,                    -- Data mais recente para o mês/ano
                        tb.value as balance                            -- Saldo correspondente à data mais recente
                    FROM 
                        TotalBalanceLogs tb
                    INNER JOIN (
                        SELECT 
                            userId,
                            MAX(dateRelease) as maxDateRelease,        -- Última data de lançamento para cada mês/ano
                            strftime('%m', dateRelease) as month,
                            strftime('%Y', dateRelease) as year
                        FROM 
                            TotalBalanceLogs
                        WHERE 
                            userId = ${userId}
                        GROUP BY 
                            year, month
                    ) sub ON 
                        tb.userId = sub.userId AND 
                        tb.dateRelease = sub.maxDateRelease            -- Junta com a tabela original pela data máxima
                    WHERE 
                        tb.userId = ${userId}
                    ORDER BY 
                        tb.dateRelease DESC;                           -- Ordena pela data mais recente
                `);
            history = history.rows.raw().map(item => {
                item.lastDate = moment(`${item.year}-${item.month}`, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');
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

                const dataPreviousMonth = {
                    previousMonth: true,
                    ...history.find(item => item.month == previousMonthNumber),
                    month: { number: previousMonthNumber, name: capitalizeFirstLetter(previousMonth.format('MMM')) },
                };

                months.push(dataPreviousMonth);
            }


            // Mês atual
            const currentMonth = moment();
            const currentMonthNumber = currentMonth.month() + 1;

            const dataCurrentMonth = {
                currentMonth: true,
                ...history.find(item => item.month == currentMonthNumber),
                month: { number: currentMonthNumber, name: capitalizeFirstLetter(currentMonth.format('MMM')) },
            }
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
                    month: { number: nextMonthNumber, name: capitalizeFirstLetter(nextMonth.format('MMM')) },
                    lastDate: moment(`${nextMonth.year()}-${nextMonthNumber}`, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
                };

                // Previsão de rendimento do CDI para o mês atual
                nextBalance += nextBalance * (cdiRate / 12);

                delete dataNextMonth.currentMonth
                dataNextMonth.balance = nextBalance
                months.push(dataNextMonth);
            }

            // console.log(months);
            return months;

        } catch (e) {
            console.error(e)
        }
    }
}

export default new TotalBalanceLogs('TotalBalanceLogs', 'TotalBalanceLogs tb');