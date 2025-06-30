export function mediaFactory(mediaData) {
  const { image, video, title, likes } = mediaData;
  const mediaContainer = document.createElement("div");
  mediaContainer.classList.add("media-card");

  let mediaElement;

  if (image) {
    mediaElement = document.createElement("img");
    mediaElement.setAttribute(
      "src",
      `assets/photographers/${mediaData.photographerName}/${image}`
    );
    mediaElement.setAttribute("alt", title);
  } else if (video) {
    mediaElement = document.createElement("video");
    mediaElement.setAttribute(
      "src",
      `assets/photographers/${mediaData.photographerName}/${video}`
    );
    mediaElement.setAttribute("controls", true);
  }

  const mediaInfo = document.createElement("div");
  mediaInfo.innerHTML = `
        <h3>${title}</h3>
        <div class="likes">
            <span class="like-count">${likes}</span>
            <button class="like-btn" aria-label="like">♥</button>
        </div>
    `;

  mediaContainer.appendChild(mediaElement);
  mediaContainer.appendChild(mediaInfo);

  return mediaContainer;
}
