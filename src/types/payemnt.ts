import { queryItems } from "../common/type";

type createPayment = {
  fullname: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  payment: number;
  point: number;
  isPaid: boolean;
  shippingCost: number;
  totalPrice: number;
  couponId: number;
};

type updatePayment = createPayment & {
  status: string;
};

type getAllPayment = queryItems & {
  fullname?: string;
  phone?: string;
  status?: string;
};

export type { createPayment, updatePayment, getAllPayment };
