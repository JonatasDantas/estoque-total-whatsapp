import { Router } from "express";
import { WhatsapController } from "./controllers/WhatsappController";

const router = Router();
const whatsappController = new WhatsapController;

const asyncHandler = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
};

router.get('/', (req, res) => res.send('Bem vindo ao bot whatsapp!'));
router.post('/setup/:userId', asyncHandler(whatsappController.setupSession));
router.post('/sendMessage', asyncHandler(whatsappController.sendMessage));
router.get('/:userId/getAllChats', asyncHandler(whatsappController.getAllChats));

export default router;