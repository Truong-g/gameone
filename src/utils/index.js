function replaceUndefinedWithNull(obj) {
  for (let key in obj) {
    console.log(obj);
    if (obj[key] === undefined) {
      obj[key] = null;
    }
  }
  return obj;
}

function hideFields(objects, fieldsToHide) {
  return objects.map((obj) => {
    const newObj = { ...obj };
    fieldsToHide.forEach((field) => {
      delete newObj[field];
    });
    return newObj;
  });
}


function shuffleWords(words) {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = words[i];
    words[i] = words[j];
    words[j] = temp;
  }
  return words;
}
function generateRandomRoom() {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  var randomString = "";

  for (var i = 0; i < 10; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

module.exports = {
  replaceUndefinedWithNull,
  hideFields,
  shuffleWords,
  generateRandomRoom
};
