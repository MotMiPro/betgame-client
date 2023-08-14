export const parseUrlToQuery = (data, isQuery = false) => {
  var query = {};
  let qr = "";
  // parse url string to obj
  if (isQuery) {
    var pairs = (data[0] === "?" ? data.substr(1) : data).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
  }
  // parse obj to string
  else {
    if (!!data) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      qr += "?";
      keys.forEach((item, id) => {
        qr += `${item}=${values[id]}${id < keys.length - 1 ? "&" : ""}`;
      });
    }
    return qr;
  }
};
