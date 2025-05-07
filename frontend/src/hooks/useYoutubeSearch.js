function fetchYouTubeData(title) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
        title
    )}`;
}

export default fetchYouTubeData;