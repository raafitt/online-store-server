const {BasketDevice, Basket, Device}=require('../models/models')
const ApiError=require('../error/ApiError')
const { where } = require('sequelize')
const { Op } = require('sequelize')

class BasketController{
    async addDevice(req, res,next){
        try{
            let {user_id, device_id}=req.body
            let basket=await Basket.findOne({
                where:{userId:user_id}
               
            })
            let basket_device=await BasketDevice.create({basketId:basket.id, deviceId:device_id})
            return res.json(basket_device)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
        
    }

    async removeDevice(req, res, next){
        
        try{
            let {id,idsToDestroy}=req.query
            idsToDestroy = JSON.parse(idsToDestroy)
            let basket=await Basket.findOne({
            where:{userId:id}
           
        })
            await BasketDevice.destroy({
                where:{
                    deviceId:{
                        [Op.in]:idsToDestroy
                    }
                }
            })
            return res.json(basket)
        } catch(e){
            next(ApiError.badRequest((e.message)))
        }
    }

    async getBasketDevices(req, res,next){
        try{
            let {id}=req.params
            let basket=await Basket.findOne({
            where:{userId:id}
           
        })
        let basket_items=await BasketDevice.findAll({where:{basketId:basket.id}})
        let idArray=[]
        basket_items.forEach(items=>idArray.push(items.deviceId))
        let basket_devices=await Device.findAll(
            {
                where:{
                    id:{
                        [Op.in]:idArray
                    }
                }
        })
        return res.json(basket_devices)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
        
    }
}
module.exports=new BasketController()