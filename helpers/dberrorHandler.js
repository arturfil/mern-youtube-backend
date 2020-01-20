"use strict";


const uniqueMessage = error => {
  let output;
  try {
    let filedName = error.message.substring(
      error.message.lastIndexOf(".$") + 2,
      error.message.lastIndexOf("_1")
    );
    outuput = fieldName.chartAt(0).toUpperCase() +
      filedName.slice(1) + "already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }
  return output;
}

exports.errorHandler = error => {
  let message = "'";

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break
      default:
        message = "Something went wrong"
    }
  } else {
    // errorors => errorORS
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message)
        message = error.errorors[errorName].message;
    }
  }
  return message;
}