import { queryItems } from "../common/type";

type createNews = {
  title: string;
  slug: string;
  content: string;
  creator: string;
  thumbnail: string;
};

type updateNews = createNews & {};

type getAllNews = queryItems & {
  title?: string;
};

export type { createNews, updateNews, getAllNews };
