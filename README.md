# Happily Ever After

A small birthday keepsake in three separate pages: a greeting, a memory film, and a sealed personal letter. Cream paper, soft pink gingham, burgundy ribbons, and hand-drawn hearts make it feel like a handmade birthday gift. Built with HTML, CSS, and vanilla JavaScript. No installation, build step, remote fonts, analytics, or third-party embeds.

## Preview locally

From this project directory, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Stop the server with `Ctrl+C`. Opening `index.html` directly also works, but an HTTP preview is closer to GitHub Pages.

For a real iPhone on the same trusted Wi-Fi network, run `python3 -m http.server 8000 --bind 0.0.0.0` instead, then visit `http://YOUR-COMPUTERS-LOCAL-IP:8000/` in Safari. This exposes the preview to your local network while the server runs; stop it when finished.

## Files and editing

```text
index.html          A simple birthday greeting, with a CTA to the film
memories.html       The portrait memory film and an invitation to the letter
letter.html         An interactive envelope and the exact original love letter
style.css           Responsive layout, typography, colors, and reduced motion
script.js           Video fallback and reader-controlled letter reveal
assets/
  bow.svg           A small hand-drawn burgundy ribbon
  cover.svg         Included, lightweight burgundy fallback cover
  poster.svg        Typographic video poster before a personal JPEG is added
  favicon.svg       Small typographic favicon
  birthday.mp4      Add your own video here
  cover.jpg         Optional personal video poster
.nojekyll           Serves the site as plain static files on GitHub Pages
```

Edit the letter between `LOVE LETTER START` and `LOVE LETTER END` in `letter.html`. Keep each paragraph inside its own `<p>`. The latest supplied letter is preserved across all 21 paragraphs, including punctuation, the line break, and emoji. Greetings and captions are in their respective HTML pages; the message shown after playback is in `script.js`.

The greeting CTA (“点这里”) opens `memories.html`. The portrait film uses a larger frame. When it ends, “还有些心里话想对你说 ♡” becomes a link to `letter.html`; there is no automatic navigation or separate letter button. The letter page shows only a clickable envelope. Clicking it lifts the flap and slides out the paper before revealing the exact letter, without extra headings, navigation, or an ending section. Reduced motion opens it immediately. Without JavaScript, the film keeps a working letter link and the letter is directly readable. `letter.html#letter` also opens directly to the text.

Colors and font stacks are at the top of `style.css`. Fonts are local system fonts: Snell Roundhand/Apple Chancery/cursive for handwritten details, Iowan Old Style/Baskerville/Georgia for English, and Songti SC with readable Chinese fallbacks. Available handwriting fonts vary by device. The site never requests a font from another server. The gingham and paper tape are CSS; the ribbon and hearts are small SVG illustrations.

## Add or replace the video

1. Copy your MP4 to `assets/birthday.mp4` (the exact lowercase filename matters).
2. Refresh the preview. The film appears in a standard video player. If it is missing or fails to load, the quiet fallback cover appears instead.
3. Test sound, seeking, and orientation in iPhone Safari.

The video uses `controls`, `playsinline`, and `preload="metadata"`. It never autoplays. The frame starts at the provided video's 9:16 portrait ratio; metadata adapts it to a replacement file. `object-fit: contain` preserves the image without cropping. Playback never automatically navigates to the letter. If the file is missing or fails, the fallback and letter button remain available.

The supplied video has been verified: H.264 video, AAC audio, 1080×1920, 66.9 seconds, approximately 39.1 MB. Its metadata is already at the front of the MP4 for streaming. For replacement videos, use H.264 and AAC. If FFmpeg is installed, inspect a new file with:

```sh
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height -show_entries format=duration,size -of default=noprint_wrappers=1 assets/birthday.mp4
```

A large video can take time over a mobile network. Keep your original elsewhere. An optional smaller, streaming-friendly export is:

```sh
ffmpeg -i /path/to/original.mp4 \
  -map 0:v:0 -map '0:a:0?' \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart \
  assets/birthday.mp4
```

This does not crop the image or upscale its width. FFmpeg asks before overwriting an existing output. `+faststart` places metadata at the front of the MP4 so the browser can prepare playback without downloading the whole file first. File size and quality depend on the source; review the exported film before using it. `preload="metadata"` is a browser hint, and actual transferred bytes depend on the file and browser.

## Add a personal poster

Save a meaningful frame as `assets/cover.jpg`. JavaScript uses it automatically if it exists; otherwise the included typographic SVG remains the poster. No personal image is required for development. Use a reasonably compressed JPEG, ideally below about 300 KB.

You can extract a frame at three seconds with FFmpeg:

```sh
ffmpeg -ss 00:00:03 -i assets/birthday.mp4 -frames:v 1 -q:v 3 assets/cover.jpg
```

The poster stays inside the video frame without cropping. If you remove `cover.jpg`, the next refresh restores the default. Requests for the absent MP4 and optional JPEG may appear as 404s during development; the visible fallback is intentional.

## Deploy to GitHub Pages when you are ready

The source repository is [Guaguaaaa/birthday_web](https://github.com/Guaguaaaa/birthday_web). Pages is left for you to enable.

1. Keep `index.html`, `memories.html`, and `letter.html` at the repository root, with the `assets` folder intact. The local `.preview/` screenshots are ignored by Git and do not need uploading.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select your publishing branch (typically `main`) and **/(root)**, then save.
4. Wait for the Pages deployment to finish. Open the HTTPS URL shown in Settings.

Once Pages is enabled for this repository, the expected URL is `https://guaguaaaa.github.io/birthday_web/`. Keep the trailing slash when writing the NFC tag. Page links and asset URLs are relative (`memories.html`, `letter.html`, `assets/…`, `style.css`, `script.js`), so the same files work under the repository prefix. There are no application routes requiring a server or rewrite rules.

See GitHub's official [publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [project URL explanation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

### Privacy

Treat this as publicly accessible hosting. Anyone with the site or media URL can read the letter and download the film. A public repository also exposes its files and their history. A private source repository alone does not make the ordinary Pages site private. The `noindex` metadata requests that search engines avoid indexing the page; it does not restrict access. Use only personal material you are both comfortable making accessible this way. Deleting a file later does not remove copies or its earlier Git history.

The site adds no analytics, cookies, or third-party requests. GitHub itself logs visitor IP addresses for security, as described in its [Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). For enforceable privacy, use hosting with real access control rather than a hidden URL or a JavaScript password.

## Write the final URL to the NFC sticker

1. First open the final HTTPS Pages URL directly on her iPhone and verify the complete experience.
2. In an NFC tag-writing app, create a **URL / URI** record using that full URL. Write it as an NDEF record; do not store the HTML or video on the tag.
3. Follow the app's prompt to hold the sticker near the top of your phone, then verify the saved URL by reading it back.
4. With the iPhone's screen awake and unlocked, hold the top of the phone near the sticker. Tap the URL notification to open the site.
5. Test again after attaching the sticker inside the card, particularly if the card contains metallic foil.

Keep the tag rewritable while reviewing the website. There is no need to permanently lock it. Older iPhone models may require an explicit NFC reader; see Apple's [background tag reading documentation](https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading) for device behavior.

## Before gifting

- Watch the real film with sound on an iPhone, including on a mobile connection. Confirm its orientation, poster, and ability to seek.
- Read the complete letter and verify the wording. Adjust system text size or zoom to confirm comfortable reading.
- Confirm the greeting CTA opens the film, the film offers the letter when it ends, and the envelope opens on tap or keyboard activation.
- Test the final NFC tag in the finished physical card.

The page supports keyboard navigation, visible focus, reduced motion, and reading without JavaScript. It also provides a clean print layout for the letter. Browser checks on a desktop do not replace a final test with the actual video on an iPhone.
