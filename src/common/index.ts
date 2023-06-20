export const makeid = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const lastDay = (month: number, year: number) => {
  if (year % 4 === 0 && month === 2) return 29;
  if (month === 2) return 28;
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  return 30;
};
