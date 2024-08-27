const fetchLocation = async (latitude, longitude) => {
  const url = `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${latitude}%2C${longitude}&language=ro`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "fdb30fac7dmshee22c632d48569ap1d9819jsna577a39fffd6",
      "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // Schimbat de la .text() la .json()
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { fetchLocation };
