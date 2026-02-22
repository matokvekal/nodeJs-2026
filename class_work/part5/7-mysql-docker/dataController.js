
import BaseController from './basecontroller.js';
import QueryTypes from 'sequelize';

class DataController extends BaseController {
  constructor(app, modelName, sequelize) {
    super(app, modelName);
    this.sequelize = sequelize;
  }

  getStack = async (req, res) => {
    try {
      const idFromEntity = req.query.id;
      const SQL = `SELECT * FROM myStack ${
        idFromEntity ? `WHERE id=${idFromEntity}` : ""
      }`;
      const result = await this.sequelize.query(SQL, {
        type: QueryTypes.SELECT,
      });
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ error: err.message || "Some error occurred in getNames." });
    }
  };
}

export default DataController;
