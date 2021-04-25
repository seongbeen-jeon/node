const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(Sequelize){
    return super.init({
      comment : {},
      created_at : {}
    },{
      sequelize,
      timestamps : false,
      modelName : 'Comment',
      tableName : 'comments',
      paranoid : false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_generic_ci'
    });
  }
  
  static associate(db){
    db.Comment.belongsTo(db.User, {foreignKey:'commenter', targetKey : 'id'});
  }
};
