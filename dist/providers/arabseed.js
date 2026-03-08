var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;

// ArabSeed Arabic Provider — asd.pics
// Arabic-exclusive content: مسلسلات، أفلام، برامج عربية ومدبلجة
//
// Hosts used by asd.pics (discovered via live crawl):
//   savefiles.com, vidara.to, vidmoly.net/biz, bysezejataos.com, filemoon.sx, voe.sx
//
// Flow:
//   case 0: get Arabic title from TMDB
//   case 1: receive TMDB info → search asd.pics/find/?word={title}
//   case 2: receive search HTML → find first CONTENT result URL (skip nav/category links)
//           MOVIE → request contentUrl/watch/ → case 3
//           TV (direct episode hit) → request episodeUrl/watch/ → case 3
//           TV (need series page) → request contentUrl → case 4
//   case 3: receive /watch/ page (movie OR direct TV) → decode base64 embeds → case 5 embed loop
//   case 4: receive series page → find episode link → request episodeUrl/watch/ → case 3
//   case 5..6: embed_redirect loop for each embed

// Decode base64 embed URLs from the /watch/ page
function _arabseed_embeds(parseWatch, PROVIDER) {
    var urls = [];
    parseWatch('a[href*="/play/?id="], a[href*="/play?id="]').each(function (i, el) {
        var href = parseWatch(el).attr('href') || '';
        var m = href.match(/[?&]id=([A-Za-z0-9+/=_-]+)/);
        if (!m) return true;
        try {
            // Normalize base64 padding
            var b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
            while (b64.length % 4 !== 0) b64 += '=';
            var decoded = libs.string_atob(b64);
            if (decoded && decoded.indexOf('http') === 0) {
                urls.push(decoded);
                libs.log({ i: i, url: decoded }, PROVIDER, 'EMBED');
            }
        } catch (e) { /* skip bad base64 */ }
        return true;
    });
    return urls;
}

// Find episode number encoded in a URL (الحلقة-N, raw or %-encoded)
function _arabseed_epNum(href) {
    var m = href.match(/%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-(\d+)/i)
           || href.match(/\u0627\u0644\u062d\u0644\u0642\u0629-(\d+)/);
    return m ? parseInt(m[1], 10) : -1;
}

// Returns true if href is a valid content link (not a nav/structural link)
function _arabseed_isContent(href, DOMAIN) {
    if (!href || href === '#' || href === DOMAIN + '/') return false;
    if (href.indexOf('/category/') !== -1) return false;
    if (href.indexOf('/find/') !== -1) return false;
    if (href.indexOf('/wp-') !== -1) return false;
    if (href.indexOf('/tag/') !== -1) return false;
    if (href.indexOf('/page/') !== -1) return false;
    // Must contain at least one path segment beyond domain
    var path = href.startsWith('http') ? href.replace(/^https?:\/\/[^/]+/, '') : href;
    var segments = path.replace(/\/+$/, '').split('/').filter(Boolean);
    if (segments.length < 1) return false;
    // Must start with domain or be relative
    if (href.startsWith('http') && href.indexOf(DOMAIN) !== 0) return false;
    return true;
}

source.getResource = function (movieInfo, config, callback) { return __awaiter(_this, void 0, void 0, function () {
    var PROVIDER, DOMAIN, UA, tmdbInfo, arabicTitle, urlSearch, parseSearch,
        contentUrl, episodeUrl, watchPageUrl, parseContent, parseWatch,
        embedUrls, i, src;
    return __generator(this, function (_a) {
        switch (_a.label) {

            // ── case 0: get Arabic title from TMDB ───────────────────────────────────
            case 0:
                PROVIDER = 'ARABSEED';
                DOMAIN   = 'https://asd.pics';
                UA       = libs.request_getRandomUserAgent();
                libs.log({ title: movieInfo.title, type: movieInfo.type, tmdb_id: movieInfo.tmdb_id }, PROVIDER, 'START');
                if (movieInfo.type === 'tv') {
                    return [4, libs.tmdb_tv_info(movieInfo.tmdb_id, 'ar')];
                }
                return [4, libs.tmdb_movie_info(movieInfo.tmdb_id, 'ar')];

            // ── case 1: received TMDB info → search ──────────────────────────────────
            case 1:
                tmdbInfo    = _a.sent();
                arabicTitle = tmdbInfo && tmdbInfo.title ? tmdbInfo.title : movieInfo.title;
                libs.log({ arabicTitle: arabicTitle }, PROVIDER, 'AR TITLE');
                urlSearch = DOMAIN + '/find/?word=' + encodeURIComponent(arabicTitle);
                libs.log({ urlSearch: urlSearch }, PROVIDER, 'SEARCH');
                return [4, libs.request_get(urlSearch, { 'user-agent': UA, 'Referer': DOMAIN + '/' }, true)];

            // ── case 2: received search results → pick first CONTENT URL ─────────────
            case 2:
                parseSearch = _a.sent();
                if (typeof parseSearch !== 'function') {
                    console.warn('[ARABSEED] Search blocked | url=' + urlSearch);
                    return [2];
                }

                // Build title keyword for URL matching
                // Convert Arabic title to lowercase URL-encoded keywords
                // e.g. "رامز ليفل" → ["%d8%b1%d8%a7%d9%85%d8%b2", "%d9%84%d9%8a%d9%81%d9%84"]
                var titleWords = arabicTitle.trim().split(/\s+/).map(function(w) {
                    return encodeURIComponent(w).toLowerCase();
                }).filter(function(w) { return w.length > 4; }); // skip short words

                // Score a URL by how many title words appear in it
                function _arabseed_score(full) {
                    if (!_arabseed_isContent(full, DOMAIN)) return -1;
                    var lower = full.toLowerCase();
                    var score = 0;
                    for (var wi = 0; wi < titleWords.length; wi++) {
                        if (lower.indexOf(titleWords[wi]) !== -1) score++;
                    }
                    return score;
                }

                // Collect all candidate links and pick the one with highest title match score
                contentUrl = null;
                var bestScore = -1;
                parseSearch('a[href]').each(function (i, el) {
                    var href = parseSearch(el).attr('href') || '';
                    var full = href.startsWith('http') ? href : DOMAIN + href;
                    var score = _arabseed_score(full);
                    if (score > bestScore) {
                        bestScore = score;
                        contentUrl = full;
                    }
                });
                libs.log({ contentUrl: contentUrl, score: bestScore }, PROVIDER, 'BEST RESULT');

                if (!contentUrl) {
                    console.warn('[ARABSEED] No results | arabicTitle=' + arabicTitle);
                    return [2];
                }

                // MOVIE: go straight to /watch/ page → case 3
                if (movieInfo.type !== 'tv') {
                    watchPageUrl = contentUrl.replace(/\/+$/, '') + '/watch/';
                    libs.log({ watchPageUrl: watchPageUrl }, PROVIDER, 'MOVIE WATCH');
                    return [4, libs.request_get(watchPageUrl, { 'user-agent': UA, 'Referer': contentUrl }, true)];
                }

                // TV: search result is directly the right episode?
                episodeUrl = null;
                if (_arabseed_epNum(contentUrl) === movieInfo.episode) {
                    episodeUrl   = contentUrl;
                    watchPageUrl = episodeUrl.replace(/\/+$/, '') + '/watch/';
                    libs.log({ episodeUrl: episodeUrl }, PROVIDER, 'DIRECT EP HIT');
                    return [4, libs.request_get(watchPageUrl, { 'user-agent': UA, 'Referer': episodeUrl }, true)];
                }

                // TV: need to dig into series/episode list page → case 4
                return [4, libs.request_get(contentUrl, { 'user-agent': UA, 'Referer': DOMAIN + '/' }, true)];

            // ── case 3: received /watch/ page (movie OR direct-TV) → extract embeds ──
            case 3:
                parseWatch = _a.sent();
                if (typeof parseWatch !== 'function') {
                    console.warn('[ARABSEED] Watch page blocked | url=' + watchPageUrl);
                    return [2];
                }
                embedUrls = _arabseed_embeds(parseWatch, PROVIDER);
                if (embedUrls.length === 0) {
                    console.warn('[ARABSEED] No embeds | url=' + watchPageUrl);
                    return [2];
                }
                return [3, 6]; // skip cases 4 & 5, jump to embed loop

            // ── case 4: received series/episode list page → find correct episode ──────
            case 4:
                parseContent = _a.sent();
                episodeUrl   = null;
                if (typeof parseContent === 'function') {
                    parseContent('a[href]').each(function (i, el) {
                        if (episodeUrl) return false;
                        var href = parseContent(el).attr('href') || '';
                        if (_arabseed_epNum(href) === movieInfo.episode) {
                            episodeUrl = href.startsWith('http') ? href : DOMAIN + href;
                            libs.log({ episodeUrl: episodeUrl, ep: movieInfo.episode }, PROVIDER, 'EP MATCH');
                            return false;
                        }
                        return true;
                    });
                }
                if (!episodeUrl) {
                    console.warn('[ARABSEED] Episode ' + movieInfo.episode + ' not found | url=' + contentUrl);
                    return [2];
                }
                watchPageUrl = episodeUrl.replace(/\/+$/, '') + '/watch/';
                libs.log({ watchPageUrl: watchPageUrl }, PROVIDER, 'TV WATCH');
                return [4, libs.request_get(watchPageUrl, { 'user-agent': UA, 'Referer': episodeUrl }, true)];

            // ── case 5: received /watch/ page (TV via series lookup) → extract embeds ─
            case 5:
                parseWatch = _a.sent();
                if (typeof parseWatch !== 'function') {
                    console.warn('[ARABSEED] TV watch page blocked | url=' + watchPageUrl);
                    return [2];
                }
                embedUrls = _arabseed_embeds(parseWatch, PROVIDER);
                if (embedUrls.length === 0) {
                    console.warn('[ARABSEED] No embeds (TV) | url=' + watchPageUrl);
                    return [2];
                }
                // fall through to embed loop

            // ── case 6..7: embed_redirect loop ───────────────────────────────────────
            case 6:
                libs.log({ count: embedUrls.length }, PROVIDER, 'EMBEDS');
                i = 0;
                _a.label = 7;

            case 7:
                if (i >= embedUrls.length) return [3, 9];
                src = embedUrls[i];
                libs.log({ i: i, src: src }, PROVIDER, 'REDIRECT');
                return [4, libs.embed_redirect(src, false, movieInfo, PROVIDER, callback, null, [])];

            case 8:
                _a.sent();
                i++;
                return [3, 7];

            case 9:
                return [2, true];
        }
    });
}); };
