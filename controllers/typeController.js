const { json, where } = require('sequelize')
const {Type, Device}=require('../models/models')
const { Op } = require('sequelize')
const ApiError = require('../error/ApiError')
class TypeController{

    async create(req,res){
        const {name}=req.body
        const type=await Type.create({name})
        return res.json(type)
    }

    async delete(req, res,next){
        try{
            let {idsToDestroy}=req.query
            idsToDestroy=JSON.parse(idsToDestroy)
            await Type.destroy({
                where:{
                    id:{
                        [Op.in]:idsToDestroy
                    }
                }}

            )
            await Device.destroy({
                where: {
                    typeId: {
                        [Op.in]: idsToDestroy
                    }
                }
            });
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req,res){
        const types=await Type.findAll()
        return res.json(types)
    }

   
}

module.exports=new TypeController()