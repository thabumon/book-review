var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { ResumeToken } = require('mongodb')
var objectId = require('mongodb').ObjectID
 module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
        })
        

    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password, user.Password).then((status)=>{
                    if(status){
                        console.log("login successful");
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('Login failed');
                resolve({status:false})
            }
            
        })
    },
    doComment:(userCommentObj)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.COMMENT_COLLECTION).insertOne(userCommentObj).then((data)=>{
                resolve(data.ops[0]);
            })
        })
    }
}