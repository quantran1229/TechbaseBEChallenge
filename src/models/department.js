"use strict";
import Sequelize,{
    Op
} from "sequelize";

module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("department", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
    },
    status: {
        type:DataTypes.INTEGER,
        defaultValue:1
    },
    type: {
        type:DataTypes.INTEGER,
        defaultValue:1
    },
    leaderId:{
      type:DataTypes.INTEGER,
    }
    },{
      timestamps: true,
    }
  );
  Department.associate = function (models) {
    // associations can be defined here
    Department.belongsTo(models.member,{
      foreignKey: "leaderId",
      sourceKey: "id",
      as: "leader",
    })
  };

  //STATUS
  Department.STATUS_ACTIVE = 1
  Department.STATUS_INACTIVE = -1

  //TYPE
  Department.TYPE_NORMAL = 1

  //SCOPE
  
  return Department;
};