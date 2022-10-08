export default function serializer(obj) {
  for (let key in obj) {
    if (obj[key] === "true") obj[key] = true;
    else if (obj[key] === "false") obj[key] = false;
    else if (obj[key] === "null") obj[key] = null;
    else if (obj[key] === "undefined") obj[key] = undefined;
    else if (obj[key] === "NaN") obj[key] = NaN;
    else if (
      typeof obj[key] != "boolean" &&
      obj[key].length < 7 &&
      obj[key] !== "" &&
      !isNaN(obj[key])
    )
      obj[key] = parseInt(obj[key]);
  }
  return obj;
}
