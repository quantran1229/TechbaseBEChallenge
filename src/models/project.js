"use strict";
import Sequelize, { Op } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "project",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      type: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      departmentId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
    }
  );
  Project.associate = function (models) {
    // associations can be defined here
    Project.belongsTo(models.department, {
      foreignKey: "departmentId",
      sourceKey: "id",
      as: "department",
    });
    Project.belongsToMany(models.member, {
      through:models.project_assignee,
      as:'members_list',
    });
  };

  //STATUS
  Project.STATUS_ACTIVE = 1;
  Project.STATUS_INACTIVE = -1;

  //TYPE
  Project.TYPE_NORMAL = 1;

  //SCOPE

  return Project;
};
