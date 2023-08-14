export const variablesBySessionStorage = (type, name, data = false) => {
  switch (type) {
    case "SET":
      const savingData = JSON.stringify(data);
      localStorage.setItem(name, savingData);
      break;
    case "GET":
      const dataParse = localStorage.getItem(name);
      return JSON.parse(dataParse);
    case "REMOVE":
      localStorage.removeItem(name);
      break;
    case "CLEAR":
      localStorage.clear();
      break;
    default:
      break;
  }
};
