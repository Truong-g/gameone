const db = require("../configs/database");
const getQuestions = async (ctx) => {
  try {
    const [rows] = await db.execute(`
            SELECT * FROM questions
            `);
    ctx.body = rows;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};


const createQuestion = async () => {
//     try {
        
// const [rows] = await db.execute(`
//     INSERT INTO (category_id, )
//     `)

//     } catch (error) {
        
//     }
}

module.exports = {
  getQuestions,
  createQuestion
};
