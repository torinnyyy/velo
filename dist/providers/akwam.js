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
// Covers Arabic-exclusive content: برامج (shows), مسلسلات (series), أفلام (movies)
// Fix: akwam search engine is Arabic-only → must fetch Arabic title from TMDB first
// Flow: TMDB ar title → search ak.sv → first result → episode page (TV) → watch_id → embed_callback
source.getResource = function (movieInfo, config, callback) { return __awaiter(_this, void 0, void 0, function () {
    var PROVIDER, DOMAIN, tmdbInfo, arabicTitle, urlSearch, parseSearch, contentUrl, watchId, watchUrl,
        parseContent, episodeUrl, parseEpisode, watchLink;
    return __generator(this, function (_a) {
        switch (_a.label) {

            // ── Step 1: Get Arabic title from TMDB ───────────────────────────────────
            case 0:
                PROVIDER = 'AKWAM';
                DOMAIN = 'https://ak.sv';
                libs.log({ title: movieInfo.title, type: movieInfo.type, tmdb_id: movieInfo.tmdb_id }, PROVIDER, 'START');
                if (movieInfo.type === 'tv') {
                    return [4, libs.tmdb_tv_info(movieInfo.tmdb_id, 'ar')];
                }
                return [4, libs.tmdb_movie_info(movieInfo.tmdb_id, 'ar')];

            case 1:
                tmdbInfo = _a.sent();
                arabicTitle = tmdbInfo && tmdbInfo.title ? tmdbInfo.title : movieInfo.title;
                libs.log({ arabicTitle: arabicTitle }, PROVIDER, 'AR TITLE');

                // ── Step 2: Search with Arabic title ─────────────────────────────────
                urlSearch = DOMAIN + '/search?q=' + encodeURIComponent(arabicTitle);
                libs.log({ urlSearch: urlSearch }, PROVIDER, 'SEARCH');
                return [4, libs.request_get(urlSearch, {}, true)];

            case 2:
                parseSearch = _a.sent();
                if (typeof parseSearch !== 'function') {
                    console.warn('[AKWAM] Search request blocked | url=' + urlSearch);
                    return [2];
                }

                // Take first matching content link — search is accurate with Arabic title
                contentUrl = null;
                parseSearch('a[href*="/series/"], a[href*="/shows/"], a[href*="/movie/"]').each(function (i, el) {
                    if (contentUrl) return false;
                    var href = parseSearch(el).attr('href');
                    if (href && href.indexOf(DOMAIN) === 0) {
                        contentUrl = href;
                        libs.log({ contentUrl: contentUrl }, PROVIDER, 'FIRST RESULT');
                        return false;
                    }
                });

                if (!contentUrl) {
                    console.warn('[AKWAM] No results found | arabicTitle=' + arabicTitle);
                    return [2];
                }

            // ── Step 3: Load content page ─────────────────────────────────────────
                return [4, libs.request_get(contentUrl, {}, true)];

            case 3:
                parseContent = _a.sent();
                if (typeof parseContent !== 'function') {
                    console.warn('[AKWAM] Content page failed | url=' + contentUrl);
                    return [2];
                }

                // ── MOVIE branch ─────────────────────────────────────────────────────
                if (movieInfo.type !== 'tv') {
                    watchLink = parseContent('a[href*="go.ak.sv/watch"]').first().attr('href');
                    libs.log({ watchLink: watchLink }, PROVIDER, 'MOVIE WATCH LINK');
                    if (!watchLink) {
                        console.warn('[AKWAM] No watch link on movie page | url=' + contentUrl);
                        return [2];
                    }
                    watchId = watchLink.replace(/.*\/watch\/(\d+).*/, '$1');
                    watchUrl = DOMAIN + '/watch/' + watchId;
                    libs.log({ watchUrl: watchUrl }, PROVIDER, 'MOVIE WATCH URL');
                    return [4, libs.embed_callback(watchUrl, PROVIDER, 'Akwam', 'mp4', callback, 1, [], [], { 'Referer': DOMAIN + '/' })];
                }

                // ── TV branch: find episode by number ────────────────────────────────
                // Episode hrefs contain /الحلقة-{N} (raw Arabic) or encoded form
                episodeUrl = null;
                parseContent('a[href*="/episode/"]').each(function (i, el) {
                    if (episodeUrl) return false;
                    var href = parseContent(el).attr('href') || '';
                    // Match raw Arabic: /الحلقة-{N}
                    var m = href.match(/\/\u0627\u0644\u062d\u0644\u0642\u0629-(\d+)/) ||
                    // Match URL-encoded: /%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-{N}
                            href.match(/%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-(\d+)/i);
                    if (m && parseInt(m[1], 10) === movieInfo.episode) {
                        episodeUrl = href;
                        libs.log({ episodeUrl: episodeUrl, ep: movieInfo.episode }, PROVIDER, 'EPISODE MATCH');
                        return false;
                    }
                });

                // Also check /show/episode/ links for shows (different path pattern)
                if (!episodeUrl) {
                    parseContent('a[href*="/show/episode/"]').each(function (i, el) {
                        if (episodeUrl) return false;
                        var href = parseContent(el).attr('href') || '';
                        var m = href.match(/\/\u0627\u0644\u062d\u0644\u0642\u0629-(\d+)/) ||
                                href.match(/%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-(\d+)/i);
                        if (m && parseInt(m[1], 10) === movieInfo.episode) {
                            episodeUrl = href;
                            libs.log({ episodeUrl: episodeUrl, ep: movieInfo.episode }, PROVIDER, 'SHOW EPISODE MATCH');
                            return false;
                        }
                    });
                }

                if (!episodeUrl) {
                    console.warn('[AKWAM] Episode not found | ep=' + movieInfo.episode + ' | url=' + contentUrl);
                    return [2];
                }

            // ── Step 4: Load episode page → extract watch_id ──────────────────────
                return [4, libs.request_get(episodeUrl, {}, true)];

            case 4:
                parseEpisode = _a.sent();
                if (typeof parseEpisode !== 'function') {
                    console.warn('[AKWAM] Episode page failed | url=' + episodeUrl);
                    return [2];
                }

                watchLink = parseEpisode('a[href*="go.ak.sv/watch"]').first().attr('href');
                libs.log({ watchLink: watchLink }, PROVIDER, 'EPISODE WATCH LINK');

                if (!watchLink) {
                    console.warn('[AKWAM] No watch link on episode page | url=' + episodeUrl);
                    return [2];
                }

                watchId = watchLink.replace(/.*\/watch\/(\d+).*/, '$1');
                watchUrl = DOMAIN + '/watch/' + watchId;
                libs.log({ watchUrl: watchUrl, watchId: watchId }, PROVIDER, 'FINAL WATCH URL');

            // ── Step 5: Send to player ───────────────────────────────────────────
                return [4, libs.embed_callback(watchUrl, PROVIDER, 'Akwam', 'mp4', callback, 1, [], [], { 'Referer': DOMAIN + '/' })];

            case 5:
                _a.sent();
                return [2, true];
        }
    });
}); };
