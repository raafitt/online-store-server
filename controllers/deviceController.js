const {Device, DeviceInfo, Type, Brand}=require('../models/models')
const uuid=require('uuid')
const path=require('path')
const ApiError=require('../error/ApiError')
const { where, Op } = require('sequelize')
const { Sequelize } = require('../db')

class DeviceController{

    async create(req,res,next){
        try{
            let {name,price,brandId, typeId, info}=req.body
            const {img}=req.files
            let fileName=uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device=await Device.create({name,price,brandId, typeId, img:fileName })
            

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        tittle: i.tittle,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }
            return res.json(device)
        }
         catch(e){
            next(ApiError.badRequest(e.message))
            }

    
        
        
    }

    async delete(req, res, next){
        let {idsToDestroy}=req.query
        idsToDestroy = JSON.parse(idsToDestroy)
        
        try{
            await Device.destroy({
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
        let {brandId, typeId, limit, page}=req.query
        page=page || 1;
        limit=limit || 5;
        let offset=page*limit-limit;
        let devices;
        
        if(brandId && !typeId){
            devices=await Device.findAndCountAll({where:{brandId}, limit, offset})
           
        }

        if(!brandId && typeId){
            devices=await Device.findAndCountAll({where:{typeId}, limit, offset})
        }

        if(brandId && typeId){
            devices=await Device.findAndCountAll({where:{brandId,typeId}, limit, offset})
        }

        if (brandId == -1) {
            devices=await Device.findAndCountAll({where:{typeId}, limit, offset})
        }  
        if (typeId == -1 ) {
            devices=await Device.findAndCountAll({where:{brandId}, limit, offset})
        }



        return res.json(devices)
        
    }

    async getOne(req,res,next){
        const {id}=req.params
        if(!id){
            next(ApiError.badRequest("Не указан ID"))
        }
        let device=await Device.findOne(
            {
                where:{id},
                include: [{model:DeviceInfo, as:'info'}]
            }
            )
        return res.json(device)
    }

    async  autoComplSearch(req, res, next) {
        let { query } = req.query;
        try {
            let devices = await Device.findAll({
                where: {
                    [Op.or]: [{ name: { [Op.iLike]: `%${query}%` } }]
                },
                attributes: ['name','id'] // Возвращаем только названия и id устройств для автокомплита
            });
            let types = await Type.findAll({
                where: {
                    [Op.or]: [{ name: { [Op.iLike]: `%${query}%` } }]
                },
                attributes: ['name','id'] 
            });
            let brands = await Brand.findAll({
                where: {
                    [Op.or]: [{ name: { [Op.iLike]: `%${query}%` } }]
                },
                attributes: ['name','id'] 
            });
            const devicesWithTypes=devices.map(device=>{
                return{
                    ...device, 
                    type:'device'}
                })
            const typesWithTypes=types.map(type=>{
                return{
                    ...type, 
                    type:'type'}
                }) 
            const brandsWithTypes=brands.map(brand=>{
                return{
                    ...brand, 
                    type:'brand'}
                })
            let recommendations = [...devicesWithTypes,...typesWithTypes,...brandsWithTypes]
            res.json(recommendations);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}
module.exports=new DeviceController()