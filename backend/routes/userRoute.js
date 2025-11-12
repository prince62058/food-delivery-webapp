import express from 'express';
import { Login, register, getProfile, updateAddress, addAddress, getAddresses, deleteAddress, forgotPassword, resetPassword, googleLogin} from '../controllers/userController.js';

const useRouter = express.Router();


useRouter.post('/register',register);
useRouter.post('/login',Login);
useRouter.post('/google-login', googleLogin);
useRouter.post('/forgot-password', forgotPassword);
useRouter.post('/reset-password', resetPassword);
useRouter.post('/profile', getProfile);
useRouter.post('/update-address', updateAddress);
useRouter.post('/add-address', addAddress);
useRouter.post('/get-addresses', getAddresses);
useRouter.post('/delete-address', deleteAddress);

export default useRouter;
