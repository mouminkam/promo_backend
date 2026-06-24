// ============================================
// Promoo Backend — Seat Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { seatService } from '../services/seat.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class SeatController {
  async getSeats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tier = req.query.tier as string | undefined;
      const data = await seatService.getSeats(tier);
      apiResponse.success(res, data, 'Seats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMySeats(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await seatService.getMySeats(userId);
      apiResponse.success(res, data, 'Your booked seats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async bookSeat(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seatId = req.params.id as string;
      const userId = req.user!.id;
      const data = await seatService.bookSeat(seatId, userId);
      apiResponse.success(res, data, 'Checkout session created successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelSeat(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seatId = req.params.id as string;
      const userId = req.user!.id;
      const token = (req.headers.authorization as string).split(' ')[1];
      const data = await seatService.cancelSeat(seatId, userId, token);
      apiResponse.success(res, data, 'Seat cancelled successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const seatController = new SeatController();
