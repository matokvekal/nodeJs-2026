class BaseController {
  modelName = "";
  _dbModel = null;
  app = null;
  _sequelize = null; // Newly added private variable for sequelize

  constructor(app, modelName) {
    this.app = app;
    this.modelName = modelName;
  }

  get dbModel() {
    if (!this.modelName) {
      console.error("Missing model name");  // Replaced Logger with console for simplicity
    }
    if (!this._dbModel) {
      this._dbModel = this.app.get("dbModels")[this.modelName];
    }
    return this._dbModel;
  }

  get allModel() {
    return this.app.get("dbModels");
  }

  // Updated getter for sequelize
  get sequelize() {
    return this._sequelize ? this._sequelize : this.app.get("dbModels").sequelize;
  }

  // Newly added setter for sequelize
  set sequelize(sequelizeInstance) {
      this._sequelize = sequelizeInstance;
  }
}

export default BaseController;
