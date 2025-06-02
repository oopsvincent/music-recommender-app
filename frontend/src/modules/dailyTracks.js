// dailyTracks.js
import { getArrayOFRandomTracks } from "./getRandomTracksArray.js";

const fetchDailyTracks = async () => {
  return await getArrayOFRandomTracks();

};

export default fetchDailyTracks;
