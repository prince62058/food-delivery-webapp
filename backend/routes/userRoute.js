import express from 'express';
import { Login, register} from '../controllers/userController.js';

const useRouter = express.Router();


useRouter.post('/register',register);
useRouter.post('/login',Login);

export default useRouter;