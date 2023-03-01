export default async (to, from, next) => {
  console.log("to", to);
  console.log("from", from);
  next();
};
