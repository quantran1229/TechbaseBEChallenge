import faker from 'faker/locale/vi'
import {
    member as Member,
    project as Project,
    department as Department,
    project_assignee as ProjectAssignee
  } from "../models";

let run= async ()=>{
    for (var i = 0;i < 1500;i++)
    {
        let type = 3
        if (i < 1) type = 1
        else if (i < 11) type = 2
        let data = {
            full_name:faker.name.findName(),
            type:type,
            password:"$2a$08$FAwlxDqnJCOPQYKWCCJVp.lldh1URR8iflWtHjgZdHiFjUFPnpf5O"
        }
        await Member.create(data)
    }
    for (var i = 0;i < 10;i++)
    {
        let leaderId = i + 2
        let data = {
            name:faker.commerce.department(),
            leaderId:leaderId
        }
        await Department.create(data)
    }
    for (var i = 0;i < 150;i++)
    {
        let departmentId = i/15 + 1
        let data = {
            name:faker.commerce.productName(),
            departmentId:Math.floor(departmentId)
        }
        await Project.create(data)
    }
    let currentMember = 12
    for (let i = 1;i <= 150;i++)
    {
        for (let j = currentMember;j < currentMember + 30 && j <= 1500;j++)
        {
            let data = {
                projectId:i,
                memberId:j
            }
            await ProjectAssignee.create(data)
        }
        currentMember = currentMember + 10 > 1500 ? currentMember - 20 : currentMember + 10
    }
}

run()