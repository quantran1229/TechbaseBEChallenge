import {
  member as Member,
  project as Project,
  department as Department,
  project_assignee as ProjectAssignee,
} from "./../models";

import Sequelize from "sequelize";
const Op = Sequelize.Op;

import { util as Util } from "../services";
const util = new Util();

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

//function for department lead
//for department lead, I only get list of worker who work in projects that belongs to department
class DepartmentLead {
  static async list(currentMember, filter) {
    //get list of member join in projects of this departments
    let projectFilter = {};
    let projectsArray = [];
    let department = await Department.findOne({
      where: {
        leaderId: currentMember.id,
      },
    });

    if (department) {
      let projects = await Project.findAll({
        where: {
          departmentId: department.id,
        },
        attributes: ["id"],
        raw: true,
      });
      projectsArray = projects.map((e) => e.id);
    }

    //filter
    let condition = {};

    if (filter.projectId) {
      if (projectsArray.includes(filter.projectId * 1))
      projectFilter.id = filter.projectId * 1;
      else projectFilter.id = {
        [Op.is]:null
      }
    } else {
      condition = {
        [Op.or]: [
          {
            id: currentMember.id,
          },
          Sequelize.literal(
            `"projects_list"."id" IN (${projectsArray.toString()})`
          ),
        ],
      };
    }
    let members = await Member.scope("information").findAll({
      where: condition,
      include: [
        {
          model: Project,
          as: "projects_list",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
          where: projectFilter,
          required: projectFilter.id ? true : false,
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["id", "ASC"]],
    });
    let count = await Member.findAll({
      where: condition,
      attributes: [
        [Sequelize.literal(`COUNT(DISTINCT "member"."id")`), "count"],
      ],
      include: [
        {
          model: Project,
          as: "projects_list",
          where: projectFilter,
          attributes: [],
          through: {
            attributes: [],
          },
          required: projectFilter.id ? true : false,
        },
      ],
      raw: true,
    });
    return {
      count: count[0].count * 1,
      data: members,
    };
  }
}

//function for normal worker
//for normal worker, I only get list of all workers who work in same projects as current worker
class MemberWorker {
  static async list(currentMember, filter) {
    //filter
    let condition = {};
    let projectFilter = {};
    //get list of project that this member join
    let projects = await ProjectAssignee.findAll({
      where: {
        memberId: currentMember.id,
      },
      attributes: ["projectId"],
      raw: true,
    });
    let projectsArray = projects.map((e) => e.projectId)
    projectFilter.id = {
      [Op.in]: projectsArray,
    };

    if (filter.projectId) {
      if (projectsArray.includes(filter.projectId * 1))
      projectFilter.id = filter.projectId * 1;
      else projectFilter.id = {
        [Op.is]:null
      }
    }

    let members = await Member.scope("information").findAll({
      where: condition,
      include: [
        {
          model: Project,
          as: "projects_list",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
          where: projectFilter,
          required: true,
        },
      ],
      order: [["id", "ASC"]],
    });
    let count = await Member.findAll({
      where: condition,
      attributes: [
        [Sequelize.literal(`COUNT(DISTINCT "member"."id")`), "count"],
      ],
      include: [
        {
          model: Project,
          as: "projects_list",
          where: projectFilter,
          attributes: [],
          through: {
            attributes: [],
          },
          required: true,
        },
      ],
      raw: true,
    });
    return {
      count: count[0].count * 1,
      data: members,
    };
  }
}

//function for director
//for director, we get list of all members
class Director {
  static async list(currentMember, filter) {
    //filter
    let condition = {};
    let projectFilter = {};

    if (filter.projectId) {
      projectFilter.id = filter.projectId;
    }

    let members = await Member.scope("information").findAll({
      where: condition,
      include: [
        {
          model: Project,
          as: "projects_list",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
          where: projectFilter,
          required: projectFilter.id ? true : false,
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["id", "ASC"]],
    });
    let count = await Member.findAll({
      where: condition,
      attributes: [
        [Sequelize.literal(`COUNT(DISTINCT "member"."id")`), "count"],
      ],
      include: [
        {
          model: Project,
          as: "projects_list",
          where: projectFilter,
          attributes: [],
          through: {
            attributes: [],
          },
          required: projectFilter.id ? true : false,
        },
      ],
      raw: true,
    });
    return {
      count: count[0].count * 1,
      data: members,
    };
  }
}

class MemberController {
  static async getList(ctx, next) {
    try {
      let { projectId } = ctx.request.query;
      let filter = {};
      if (projectId) filter.projectId = projectId;

      //get latest infomation of the current member
      let currentMember = await Member.findOne({
        where: {
          id: ctx.state.user.id,
        },
      });

      //check on the current type of member is what(director or member or department lead), then using list function
      let memberType;
      switch (currentMember.type) {
        case Member.TYPE_DIRECTOR:
          memberType = Director;
          break;
        case Member.TYPE_DEPARTMENT_LEAD:
          memberType = DepartmentLead;
          break;
        case Member.TYPE_WORKER:
          memberType = MemberWorker;
          break;
      }
      let result = await memberType.list(currentMember, filter);
      util.setSuccess(200, "Members list retrived", result);
      util.send(ctx);
      return await next();
    } catch (err) {
      util.setError(500, "Error when retrieve Member list", {
        err: err.toString(),
      });
      util.send(ctx);
      return await next();
    }
  }

  //Login base on user id
  static async login(ctx, next) {
    try {
      let { password, username } = ctx.request.body;
      //find member with id = username
      let member = await Member.findOne({
        where: {
          id: username,
        },
      });

      //check if member exist or not
      if (!member) {
        util.setError(403, "Login error", {
          err: "Invalid member id or password",
        });
        util.send(ctx);
        return await next();
      }

      //check if member is active or not
      if (member.status != Member.STATUS_ACTIVE) {
        util.setError(403, "Login error", {
          err: "This account has been locked",
        });
        util.send(ctx);
        return await next();
      }

      //verify password
      let a;
      try {
        a = bcrypt.compareSync(password, member.password);
      } catch (err) {
        util.setError(403, "Login error", {
          err: err.toString(),
        });
        util.send(ctx);
        return await next();
      }

      //if password is verified, return a jwt
      if (a) {
        var user_sent = {
          id: member.id,
          type: member.type,
          full_name: member.full_name,
        };
        const token = jwt.sign(user_sent, process.env.JWT_SECRET_KEY);

        util.setSuccess(200, "Login", {
          token: token,
          user_send: user_sent,
        });
        util.send(ctx);
        return await next();
      } else {
        util.setError(403, "Login error", {
          err: "Invalid member id or password",
        });
        util.send(ctx);
        return await next();
      }
    } catch (err) {
      util.setError(500, "Login error", {
        err: err.toString(),
      });
      util.send(ctx);
      return await next();
    }
  }
}

export default MemberController;
