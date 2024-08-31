import Categories from "../Data/Categories";

let AllCategories = []
new Promise(async (resolve) => {
    try {
        const { rows = [] } = await Categories.find()
        AllCategories = rows
        resolve()

    } catch (e) {
        console.error('Erro ao buscar todas as categorias: ', e)
    }
})

module.exports = AllCategories;