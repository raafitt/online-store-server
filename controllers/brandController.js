const { Op } = require('sequelize')
const ApiError = require('../error/ApiError')
const {Brand, Device}=require('../models/models')
class BrandController{

    async create(req,res){
        const {name}=req.body
        const brand=await Brand.create({name})
        return res.json(brand)
    }

    async delete(req,res,next){
        try{
            let {idsToDestroy}=req.query
            idsToDestroy=JSON.parse(idsToDestroy)
            await Brand.destroy({
                where:{
                    id:{
                        [Op.in]:idsToDestroy
                    }
                }
            })
            return res.json(idsToDestroy)

        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req,res){
        const brands=await Brand.findAll()
        return res.json(brands)
    }

   
}

module.exports=new BrandController()