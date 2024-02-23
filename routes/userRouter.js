const Router=require('express')
const userController=require('../controllers/userController')
const authMiddleware=require('../middleware/authMiddleware')
const router=new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth',authMiddleware, userController.check)//вторым параметром передаем middleware, чтобы перед тем как попасть в контроллер проверить пользователя на авторизацию


module.exports=router