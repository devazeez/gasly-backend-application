import express, { Request, Response } from "express";

const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  res.status(200).json({
    status: req.statusMessage,
    message: "Testing",

  });
});

export { router as CustomerRoute };
