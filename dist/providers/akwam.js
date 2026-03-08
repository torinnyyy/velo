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

// Akwam Arabic Provider — ak.sv
// Arabic-exclusive content: برامج، مسلسلات، أفلام
//
// Live-tested flow:
//   case 0: get Arabic title from TMDB
//   case 1: search ak.sv?q={title} → pick first /shows/ or /series/ or /movie/ result
//   case 2: content page → MOVIE: find /watch/ link → case 4
//                        → TV: find episode link → case 3
//   case 3: episode page → find go.ak.sv/watch/{watchId} link → case 4
//   case 4: fetch go.ak.sv/watch/{watchId} → get ak.sv/watch/{watchId}/{epId}/...
//   case 5: fetch real watch page → extract src="...mp4" or iframe embeds → call embed_callback/embed_redirect

source.getResource = function (movieInfo, config, callback) { return __awaiter(_this, void 0, void 0, function () {
    var PROVIDER, DOMAIN, UA, tmdbInfo, arabicTitle, urlSearch,
        parseSearch, contentUrl, episodeUrl, goWatchUrl, realWatchUrl,
        parseContent, parseEpisode, parseGo, parseWatch,
        watchLink, m, sources, i, src;
    return __generator(this, function (_a) {
        switch (_a.label) {

            // ── case 0: get Arabic title from TMDB ───────────────────────────────────
            case 0:
                PROVIDER = 'AKWAM';
                DOMAIN   = 'https://ak.sv';
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

                urlSearch = DOMAIN + '/search?q=' + encodeURIComponent(arabicTitle);
                libs.log({ urlSearch: urlSearch }, PROVIDER, 'SEARCH');
                return [4, libs.request_get(urlSearch, { 'user-agent': UA, 'Referer': DOMAIN + '/' }, true)];

            // ── case 2: pick first content URL ───────────────────────────────────────
            case 2:
                parseSearch = _a.sent();
                if (typeof parseSearch !== 'function') {
                    console.warn('[AKWAM] Search blocked | url=' + urlSearch);
                    return [2];
                }

                contentUrl = null;
                parseSearch('a[href*="/series/"], a[href*="/shows/"], a[href*="/movie/"]').each(function (i, el) {
                    if (contentUrl) return false;
                    var href = parseSearch(el).attr('href') || '';
                    if (!href || href === '#') return true;
                    var full = href.startsWith('http') ? href : DOMAIN + href;
                    contentUrl = full;
                    libs.log({ contentUrl: contentUrl }, PROVIDER, 'FIRST RESULT');
                    return false;
                });

                if (!contentUrl) {
                    console.warn('[AKWAM] No results | arabicTitle=' + arabicTitle);
                    return [2];
                }
                return [4, libs.request_get(contentUrl, { 'user-agent': UA, 'Referer': DOMAIN + '/' }, true)];

            // ── case 3: content page ─────────────────────────────────────────────────
            case 3:
                parseContent = _a.sent();
                if (typeof parseContent !== 'function') {
                    console.warn('[AKWAM] Content page blocked | url=' + contentUrl);
                    return [2];
                }

                // MOVIE: find /watch/ link directly
                if (movieInfo.type !== 'tv') {
                    watchLink = null;
                    parseContent('a[href*="go.ak.sv/watch"], a[href*="/watch/"]').each(function (i, el) {
                        if (watchLink) return false;
                        var href = parseContent(el).attr('href') || '';
                        if (href.indexOf('/watch/') !== -1) {
                            watchLink = href.startsWith('http') ? href
                                      : href.startsWith('//') ? 'https:' + href
                                      : DOMAIN + href;
                            return false;
                        }
                        return true;
                    });
                    if (!watchLink) {
                        console.warn('[AKWAM] No watch link on movie page | url=' + contentUrl);
                        return [2];
                    }
                    goWatchUrl = watchLink;
                    libs.log({ goWatchUrl: goWatchUrl }, PROVIDER, 'MOVIE GO-WATCH');
                    return [4, libs.request_get(goWatchUrl, { 'user-agent': UA, 'Referer': contentUrl }, true)];
                }

                // TV: find episode by number
                episodeUrl = null;
                parseContent('a[href*="/episode/"], a[href*="/show/episode/"]').each(function (i, el) {
                    if (episodeUrl) return false;
                    var href = parseContent(el).attr('href') || '';
                    var epM = href.match(/\/\u0627\u0644\u062d\u0644\u0642\u0629-(\d+)/) ||
                              href.match(/%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-(\d+)/i);
                    if (epM && parseInt(epM[1], 10) === movieInfo.episode) {
                        episodeUrl = href.startsWith('http') ? href : DOMAIN + href;
                        libs.log({ episodeUrl: episodeUrl, ep: movieInfo.episode }, PROVIDER, 'EP MATCH');
                        return false;
                    }
                    return true;
                });

                if (!episodeUrl) {
                    console.warn('[AKWAM] Episode ' + movieInfo.episode + ' not found | url=' + contentUrl);
                    return [2];
                }
                return [4, libs.request_get(episodeUrl, { 'user-agent': UA, 'Referer': contentUrl }, true)];

            // ── case 4: episode page (TV) → find go.ak.sv/watch link ─────────────────
            case 4:
                parseEpisode = _a.sent();
                if (typeof parseEpisode !== 'function') {
                    console.warn('[AKWAM] Episode page blocked | url=' + episodeUrl);
                    return [2];
                }

                watchLink = null;
                parseEpisode('a[href*="go.ak.sv/watch"], a[href*="/watch/"]').each(function (i, el) {
                    if (watchLink) return false;
                    var href = parseEpisode(el).attr('href') || '';
                    if (href.indexOf('/watch/') !== -1) {
                        watchLink = href.startsWith('http') ? href
                                  : href.startsWith('//') ? 'https:' + href
                                  : DOMAIN + href;
                        return false;
                    }
                    return true;
                });

                if (!watchLink) {
                    console.warn('[AKWAM] No go.ak.sv/watch link on episode page | url=' + episodeUrl);
                    return [2];
                }
                goWatchUrl = watchLink;
                libs.log({ goWatchUrl: goWatchUrl }, PROVIDER, 'TV GO-WATCH');
                return [4, libs.request_get(goWatchUrl, { 'user-agent': UA, 'Referer': episodeUrl }, true)];

            // ── case 5: go.ak.sv page → extract ak.sv/watch/{id}/{epId}/... link ──────
            // This page has links like:
            //   href="https://ak.sv/watch/{watchId}/{epId}/{slug}"  (main domain)
            //   href="https://two.akw.cam/watch/..."  (mirror)
            case 5:
                parseGo = _a.sent();
                if (typeof parseGo !== 'function') {
                    // go.ak.sv may return raw HTML string
                    console.warn('[AKWAM] go.ak.sv page not parsed | url=' + goWatchUrl);
                    return [2];
                }

                realWatchUrl = null;
                parseGo('a[href*="ak.sv/watch/"]').each(function (i, el) {
                    if (realWatchUrl) return false;
                    var href = parseGo(el).attr('href') || '';
                    if (href.indexOf('/watch/') !== -1 && href.indexOf('ak.sv') !== -1) {
                        realWatchUrl = href;
                        libs.log({ realWatchUrl: realWatchUrl }, PROVIDER, 'REAL WATCH URL');
                        return false;
                    }
                    return true;
                });

                if (!realWatchUrl) {
                    // Try raw HTML match as fallback
                    var rawGo = parseGo.html ? parseGo.html() : '';
                    m = rawGo.match(/href="(https:\/\/ak\.sv\/watch\/[^"]+)"/);
                    if (m) realWatchUrl = m[1];
                }

                if (!realWatchUrl) {
                    console.warn('[AKWAM] Could not find real watch URL | go=' + goWatchUrl);
                    return [2];
                }
                libs.log({ realWatchUrl: realWatchUrl }, PROVIDER, 'FETCH WATCH');
                return [4, libs.request_get(realWatchUrl, { 'user-agent': UA, 'Referer': DOMAIN + '/' }, true)];

            // ── case 6: real watch page → extract mp4/embed sources ──────────────────
            // Live test shows: src="https://s102.downet.net/download/.../....mp4"
            case 6:
                parseWatch = _a.sent();
                if (typeof parseWatch !== 'function') {
                    console.warn('[AKWAM] Watch page blocked | url=' + realWatchUrl);
                    return [2];
                }

                sources = [];

                // Primary: look for direct mp4/video src attributes
                parseWatch('[src]').each(function (i, el) {
                    var s = parseWatch(el).attr('src') || '';
                    if (!s || s.indexOf('//') === 0) {
                        if (s.startsWith('//')) s = 'https:' + s;
                    }
                    if (s.startsWith('http') && (s.indexOf('.mp4') !== -1 || s.indexOf('.m3u8') !== -1)) {
                        if (s.indexOf('histats') === -1 && s.indexOf('adsby') === -1) {
                            sources.push(s);
                        }
                    }
                });

                // Secondary: iframe embed sources
                if (sources.length === 0) {
                    parseWatch('iframe[src], iframe[data-src]').each(function (i, el) {
                        var s = parseWatch(el).attr('src') || parseWatch(el).attr('data-src') || '';
                        if (!s || s === 'about:blank') return true;
                        if (s.startsWith('//')) s = 'https:' + s;
                        if (s.startsWith('http')) sources.push(s);
                        return true;
                    });
                }

                // Tertiary: regex scan for download/video URLs in HTML
                if (sources.length === 0) {
                    var rawHtml = parseWatch.html ? parseWatch.html() : '';
                    var found = rawHtml.match(/src="(https?:\/\/[^"]+\.(mp4|m3u8)[^"]*)"/gi) || [];
                    found.forEach(function(match) {
                        var mu = match.match(/src="([^"]+)"/);
                        if (mu) sources.push(mu[1]);
                    });
                }

                // Deduplicate
                sources = sources.filter(function (v, i, a) { return a.indexOf(v) === i; });
                libs.log({ count: sources.length, sources: sources }, PROVIDER, 'SOURCES FOUND');

                if (sources.length === 0) {
                    console.warn('[AKWAM] No sources found | url=' + realWatchUrl);
                    return [2];
                }
                i = 0;
                _a.label = 7;

            // ── case 7..8: deliver sources ────────────────────────────────────────────
            case 7:
                if (i >= sources.length) return [3, 9];
                src = sources[i];
                libs.log({ i: i, src: src }, PROVIDER, 'DELIVER');
                // For direct mp4/m3u8 → embed_callback directly (no host needed)
                // For embed URLs → embed_redirect to route through host
                if (src.indexOf('.mp4') !== -1 || src.indexOf('.m3u8') !== -1) {
                    var quality = src.indexOf('.m3u8') !== -1 ? 'Hls' : 'mp4';
                    return [4, libs.embed_callback(
                        src, PROVIDER, 'Akwam', quality, callback, 1, [],
                        [{ file: src, quality: 1080 }],
                        { 'Referer': DOMAIN + '/', 'user-agent': UA }
                    )];
                }
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
