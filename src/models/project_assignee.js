"use strict";
import Sequelize,{
    Op
} from "sequelize";

module.exports = (sequelize, DataTypes) => {
  const ProjectAssignee = sequelize.define("project_assignee", {
    projectId:{
      type: DataTypes.INTEGER,
    },
    memberId:{
      type: DataTypes.INTEGER,
    },
    },{
      timestamps: false,
    }
  );
  ProjectAssignee.removeAttribute('id')
  ProjectAssignee.associate = function (models) {
    // associations can be defined here
    ProjectAssignee.belongsTo(models.project,{
      foreignKey: "projectId",
      sourceKey: "id",
      as: "project",
    })
    ProjectAssignee.belongsTo(models.member,{
      foreignKey: "memberId",
      sourceKey: "id",
      as: "member",
    })
  };

  //SCOPE
  
  return ProjectAssignee;
};