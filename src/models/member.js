"use strict";
import Sequelize, { Op } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "member",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
      },
      password: {
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
    },
    {
      timestamps: true,
      scopes: {
        information: {
          attributes: {
            exclude: ["password"],
          },
        },
      },
    }
  );
  Member.associate = function (models) {
    // associations can be defined here
    Member.belongsToMany(models.project, {
      through: models.project_assignee,
      as: "projects_list",
    });
    Member.hasOne(models.department, {
      as: "department",
      foreignKey: "leaderId",
      targetKey: "id",
    });
  };

  //STATUS
  Member.STATUS_ACTIVE = 1;
  Member.STATUS_INACTIVE = -1;

  //TYPE
  Member.TYPE_DIRECTOR = 1;
  Member.TYPE_DEPARTMENT_LEAD = 2;
  Member.TYPE_WORKER = 3;

  //SCOPE

  return Member;
};
