//Require the dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../app'
let should = chai.should();
let directorToken
let departmentLeadToken
let memberToken

chai.use(chaiHttp)
//Login
describe("Get list all members",()=>{
    describe('/POST login',()=>{
        it('it should not login without password or username which is int',(done)=>{
            let loginInfo = {
                "username":1
            }
            chai.request(server)
            .post('/api/login')
            .send(loginInfo)
            .end((err,res)=>{
                res.should.have.status(400)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Login error')
                done()
            })
        })
        it('it should not login if member not exist',(done)=>{
            let loginInfo = {
                "username":2000,
                "password":"123456"
            }
            chai.request(server)
            .post('/api/login')
            .send(loginInfo)
            .end((err,res)=>{
                res.should.have.status(403)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Login error')
                res.body.data.err.should.to.equal('Invalid member id or password')
                done()
            })
        })
        it('it should not login if entered password not correct',(done)=>{
            let loginInfo = {
                "username":1,
                "password":"abcdefgh"
            }
            chai.request(server)
            .post('/api/login')
            .send(loginInfo)
            .end((err,res)=>{
                res.should.have.status(403)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Login error')
                res.body.data.err.should.to.equal('Invalid member id or password')
                done()
            })
        })
        it('it should login with user with type director',(done)=>{
            let loginInfo = {
                "username":1,
                "password":"123456"
            }
            chai.request(server)
            .post('/api/login')
            .send(loginInfo)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Login')
                res.body.data.token.should.to.be.a('string')
                res.body.data.user_send.should.be.an('object')
                res.body.data.user_send.should.have.property('id')
                res.body.data.user_send.should.have.property('type')
                res.body.data.user_send.should.have.property('full_name')
                res.body.data.user_send.id.should.to.equal(1)
                res.body.data.user_send.type.should.to.equal(1)
                directorToken = res.body.data.token
                done()
            })
        })
        it('it should login with user with type department lead',(done)=>{
            let loginInfo = {
                "username":2,
                "password":"123456"
            }
            chai.request(server)
            .post('/api/login')
            .send(loginInfo)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Login')
                res.body.data.token.should.to.be.a('string')
                res.body.data.user_send.should.be.an('object')
                res.body.data.user_send.should.have.property('id')
                res.body.data.user_send.should.have.property('type')
                res.body.data.user_send.should.have.property('full_name')
                res.body.data.user_send.id.should.to.equal(2)
                res.body.data.user_send.type.should.to.equal(2)
                departmentLeadToken = res.body.data.token
                done()
            })
        })
        it('it should login with user with type director',(done)=>{
            let loginInfo = {
                "username":100,
                "password":"123456"
            }
            chai.request(server)
            .post('/api/login')
            .send(loginInfo)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Login')
                res.body.data.token.should.to.be.a('string')
                res.body.data.user_send.should.be.an('object')
                res.body.data.user_send.should.have.property('id')
                res.body.data.user_send.should.have.property('type')
                res.body.data.user_send.should.have.property('full_name')
                res.body.data.user_send.id.should.to.equal(100)
                res.body.data.user_send.type.should.to.equal(3)
                memberToken = res.body.data.token
                done()
            })
        })
    })
    describe('/GET list member',()=>{
        it('it should not get list without any token',(done)=>{
            chai.request(server)
            .get('/api/members')
            .end((err,res)=>{
                res.should.have.status(401)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Authentication error. Token required.')
                done()
            })
        })
        it('it should not get list without incorrect token',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.keH6T3x1z7mmhKL1T3r9sQdAxxdzB6siemGMr_6ZOwU'})
            .end((err,res)=>{
                res.should.have.status(400)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Invalid tokenJsonWebTokenError: invalid signature')
                done()
            })
        })
        it('it should get list with correct token for director',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":directorToken})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                let totalData = res.body.data.data.length
                res.body.data.count.should.to.equal(totalData)
                done()
            })
        })
        it('it should get list with correct token with filter projectId',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":directorToken,projectId:1})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                let totalData = res.body.data.data.length
                res.body.data.count.should.to.equal(totalData)
                let projectList = res.body.data.data.map(e=>{
                    return e.projects_list.map(i=>i.id)}
                    )
                for (let i of projectList)
                {
                    i.should.to.have.members([1])
                }
                done()
            })
        })
        it('it should get list with correct token for department lead',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":departmentLeadToken})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                let totalData = res.body.data.data.length
                res.body.data.count.should.to.equal(totalData)
                done()
            })
        })
        it('it should get list with correct token with filter projectId',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":departmentLeadToken,projectId:2})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                let totalData = res.body.data.data.length
                res.body.data.count.should.to.equal(totalData)
                let projectList = res.body.data.data.map(e=>{
                    return e.projects_list.map(i=>i.id)}
                    )
                for (let i of projectList)
                {
                    i.should.to.have.members([2])
                }
                done()
            })
        })
        it('it should get list with correct token with filter projectId not belong to department',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":departmentLeadToken,projectId:100})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                res.body.data.count.should.to.equal(0)
                res.body.data.data.should.to.have.lengthOf(0)
                done()
            })
        })
        it('it should get list with correct token for normal member',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":memberToken})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                let totalData = res.body.data.data.length
                res.body.data.count.should.to.equal(totalData)
                done()
            })
        })
        it('it should get list with correct token with filter projectId',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":departmentLeadToken,projectId:7})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                let totalData = res.body.data.data.length
                res.body.data.count.should.to.equal(totalData)
                let projectList = res.body.data.data.map(e=>{
                    return e.projects_list.map(i=>i.id)}
                    )
                for (let i of projectList)
                {
                    i.should.to.have.members([7])
                }
                done()
            })
        })
        it('it should get list with correct token with filter projectId not belong to member',(done)=>{
            chai.request(server)
            .get('/api/members')
            .query({"token":departmentLeadToken,projectId:100})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.msg.should.to.equal('Members list retrived')
                res.body.data.count.should.to.equal(0)
                res.body.data.data.should.to.have.lengthOf(0)
                done()
            })
        })
    })
});