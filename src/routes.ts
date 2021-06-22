import { Router } from "express";

const router = Router();

router.get('/', (req, res) => res.send('Bem vindo ao bot whatsapp!'));

export default router;