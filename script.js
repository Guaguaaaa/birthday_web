/* Small enhancements shared by the three static pages. */
(() => {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const video = document.getElementById("birthday-video");

  if (video) {
    const source = document.getElementById("birthday-source");
    const shell = document.getElementById("film-shell");
    const placeholder = document.getElementById("film-placeholder");
    const status = document.getElementById("film-status");
    const playbackHelp = document.getElementById("playback-help");
    const next = document.getElementById("film-next");
    const skip = document.getElementById("skip-film");
    const invitation = document.querySelector(".film-invitation");
    const note = document.getElementById("film-next-note");
    let filmWasAvailable = false;
    let filmFinished = false;

    next.hidden = true;
    skip.hidden = false;

    const offerLetter = () => {
      next.hidden = false;
      skip.hidden = true;
      invitation.classList.add("is-ready");
      note.textContent = "There’s something more I want to tell you…";
      // The reader chooses the next page. Never redirect on video end.
    };

    const showFilm = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      filmWasAvailable = true;
      video.hidden = false;
      placeholder.hidden = true;
      playbackHelp.hidden = true;
      // Recover gracefully if an early loading error is followed by metadata.
      if (!filmFinished) {
        next.hidden = true;
        skip.hidden = false;
        invitation.classList.remove("is-ready");
        note.textContent = "Press play. Take your time.";
      }
      const ratio = video.videoWidth / video.videoHeight;
      shell.style.setProperty("--film-ratio", String(ratio));
      shell.classList.toggle("is-landscape", ratio > 1);
      if (Number.isFinite(video.duration)) {
        const seconds = Math.ceil(video.duration);
        document.getElementById("film-duration").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
      }
    };

    const showFallback = () => {
      video.hidden = true;
      placeholder.hidden = false;
      if (filmWasAvailable || (video.error && video.error.code === 3)) {
        status.textContent = "The film couldn’t finish loading. You can try opening it below.";
        playbackHelp.hidden = false;
      }
      offerLetter();
    };

    video.addEventListener("loadedmetadata", showFilm);
    video.addEventListener("error", showFallback);
    source.addEventListener("error", showFallback);
    video.addEventListener("ended", () => {
      filmFinished = true;
      offerLetter();
    });
    if (video.readyState >= 1) showFilm();
    if (video.error || video.networkState === video.NETWORK_NO_SOURCE) showFallback();
    // Native controls remain available even if Safari defers preloading.
    const personalPoster = new Image();
    personalPoster.onload = () => { video.poster = personalPoster.src; };
    personalPoster.src = "assets/cover.jpg?v=2";
  }

  const envelope = document.getElementById("open-envelope");
  if (envelope) {
    const scene = document.getElementById("envelope-scene");
    const reading = document.getElementById("letter-reading");
    const status = document.getElementById("envelope-status");
    let opening = false;
    let openingTimer;

    const showLetter = (focusTitle = false) => {
      window.clearTimeout(openingTimer);
      scene.hidden = true;
      reading.hidden = false;
      envelope.setAttribute("aria-expanded", "true");
      if (focusTitle) {
        reading.classList.add("is-arriving");
        history.replaceState(null, "", "#letter");
        window.scrollTo(0, 0);
        document.getElementById("letter-title").focus({ preventScroll: true });
      }
    };

    if (["#letter", "#ending", "#letter-title"].includes(window.location.hash)) {
      showLetter();
    } else {
      scene.hidden = false;
      reading.hidden = true;
    }

    envelope.addEventListener("click", () => {
      if (opening) return;
      opening = true;
      envelope.disabled = true;
      envelope.setAttribute("aria-expanded", "true");
      status.textContent = "Opening your letter…";
      envelope.classList.add("is-opening");
      if (reducedMotion.matches) showLetter(true);
      else openingTimer = window.setTimeout(() => showLetter(true), 1050);
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches && opening) showLetter(true);
    });
    window.addEventListener("hashchange", () => {
      if (["#letter", "#ending", "#letter-title"].includes(window.location.hash)) showLetter();
    });
  }
})();
