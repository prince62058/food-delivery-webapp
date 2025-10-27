import express from 'express';
import { authMiddleware } from '../middleware/authorize.js'
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, cancelOrder } from '../controllers/orderController.js';



const orderRouter  = express.Router();


orderRouter.post('/place',authMiddleware,placeOrder);
orderRouter.post('/verify',verifyOrder);
orderRouter.post('/userorders',authMiddleware,userOrders);
orderRouter.get('/list',listOrders);
orderRouter.post('/status',updateStatus);
orderRouter.post('/cancel',authMiddleware,cancelOrder);


export default orderRouter;
