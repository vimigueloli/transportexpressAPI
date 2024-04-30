// src/helpers/monthIntervalCalculator.ts
import moment from "moment";
function monthIntervalCalculator(month, year) {
  let start;
  if (month) {
    start = `${year ? year : (/* @__PURE__ */ new Date()).getFullYear()}/${month < 10 ? "0" : ""}${month}/01`;
  } else {
    start = `${year ? year : (/* @__PURE__ */ new Date()).getFullYear()}/${(/* @__PURE__ */ new Date()).getMonth() + 1 < 10 ? "0" : ""}${(/* @__PURE__ */ new Date()).getMonth() + 1}/01`;
  }
  let end = moment(new Date(start)).endOf("month").format("YYYY-MM-DD");
  return {
    start: new Date(start),
    end: new Date(end)
  };
}

export {
  monthIntervalCalculator
};
