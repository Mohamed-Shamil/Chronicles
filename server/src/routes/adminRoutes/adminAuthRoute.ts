import express from 'express'
import {adminLogin,getUsers,getPosts,blockUser,unblockUser,blogReport,getBlogReports,unblockPost} from '../../controllers/adminControllers/adminController'

const router = express.Router()
 
router.post('/',adminLogin)
router.get('/viewUsers',getUsers)
router.get('/viewPosts',getPosts)
router.post('/blockUser/:userId',blockUser)
router.post('/unblockUser/:userId',unblockUser)
router.get('/getReportMessages',getBlogReports)
router.post('/blockPost/:postId',blogReport)
router.post('/unblockPost/:postId',unblockPost)

export default router