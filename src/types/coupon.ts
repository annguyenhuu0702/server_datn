import { queryItems } from "../common/type";

type createCoupon = {
  name: string;
  slug: string;
  type: string;
  description: string;
  startday: Date;
  endday: Date;
  percent: number;
};

type updateCoupon = createCoupon & {};

type getAllCoupon = queryItems & {};

export type { createCoupon, updateCoupon, getAllCoupon };
