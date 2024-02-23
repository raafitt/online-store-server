const Router=require('express')
const basketController=require('../controllers/basketController')
const router=new Router()

router.post('/',basketController.addDevice)
router.get('/:id',basketController.getBasketDevices)
router.delete('/',basketController.removeDevice)

module.exports=router