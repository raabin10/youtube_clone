const apiKey = "AIzaSyCnHZBG3nfG1RB7ATwCFJkAIuLJd8FyEn8";
const url = "https://www.googleapis.com/youtube/v3";

const input = document.getElementById("input");
const button = document.getElementById("button");

button.addEventListener("click", () => {
    const searchValue = input.value;
    fetchSearchVideos(searchValue);
})

document.addEventListener('DOMContentLoaded', () => {
    fetchSearchVideos("cr7");
});

async function fetchSearchVideos(searchValue) {
    try {
        const response = await fetch(
            `${url}/search?key=${apiKey}&q=${searchValue}&part=snippet&maxResults=20`
        );
        const result = await response.json();
        for (let i = 0; i < result.items.length; i++) {
            let videoId = result.items[i].id.videoId;
            let channelId = result.items[i].snippet.channelId;

            let statistics = await getVideoStatistics(videoId);
            let channelLogo = await fetchChannelLogo(channelId);

            result.items[i].snippet.statistics = statistics;
            result.items[i].snippet.channelLogo = channelLogo;
        }
        printSearchVideos(result.items);
    } catch (error) {
        console.log(error);
    }
}

async function getVideoStatistics(videoId) {
    const endpoint = `${url}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        return result.items[0].statistics;
    } catch (error) {
        alert("Failed to fetch Statistics for ", videoId);
    }
}

async function fetchChannelLogo(channelId) {
    const endpoint = `${url}/channels?key=${apiKey}&id=${channelId}&part=snippet`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        return result.items[0].snippet.thumbnails.high.url;
    } catch (error) {
        alert("Failed to load channel logo for ", channelId);
    }
}

function printSearchVideos(videosList) {
    const videoCard = document.getElementById("videoCard");
    videoCard.innerHTML = "";
    videosList.forEach((video) => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "card";
        videoContainer.innerHTML = `<a href="#">
            <div class="upper">
                <img src="${video.snippet.thumbnails.high.url}" alt="thumbnail">
                <p>23:45</p>
            </div>
            <div class="lower">
                <div class="img">
                    <img src="${video.snippet.channelLogo}" alt="channel logo">
                </div>
                <div class="para">
                    <div class="text">
                    ${video.snippet.title}
                    </div>
                    <div class="channel">
                        <p class="name">${video.snippet.channelTitle}</p>
                        <p class="view">${formatViewCount(video.snippet.statistics.viewCount)} View . ${time(video.snippet.publishTime)}</p>
                    </div>
                </div>
            </div>
            </a>`;

        videoCard.appendChild(videoContainer);
    })
}

function time(getDate) {
    const targetDate = new Date(getDate);
    const currentDate = new Date();
    const timeDifference = currentDate - targetDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const weeksDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
    const monthsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30.44));
    const yearsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));
    if (yearsDifference > 0) {
        return `${yearsDifference} years ago`;
    } else if (monthsDifference > 0) {
        return `${monthsDifference} months ago`;
    } else if (weeksDifference > 1) {
        return `${weeksDifference} weeks ago`;
    } else if (daysDifference > 0) {
        return `${daysDifference} days ago`;
    } else if (hoursDifference > 0) {
        return `${hoursDifference} hours ago`;
    } else if (minutesDifference > 0) {
        return `${minutesDifference} minutes ago`;
    }
}

function formatViewCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + ' M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + ' K';
    } else {
        return count.toString();
    }
}