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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// WYZIE Subtitles Provider â DHFLIX
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// Multi-source fallback:
//   1. Proxy via 111movies.net/wyzie  (no key, works now)
//   2. (optional) Direct sub.wyzie.io with API key (1000/day)
//   3. (optional) Multiple proxy mirrors
//
// Accepts: tmdb_id OR imdb_id (with or without 'tt' prefix)
// Returns: 6-50+ subtitles per item
//
// Ø§ÙÙØ±Ø¬Ø¹: docs/WYZIE_SUBTITLES_DISCOVERY.md
//         docs/UNLIMITED_SUBTITLES_STRATEGY.md
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

subs["WYZIE"] = function (movieInfo, config, callback) {
    return __awaiter(_this, void 0, void 0, function () {
        var PROVIDER, id, queryStr, urls, _i, urls_1, urlEntry, response, data, subList, sub, label, e_outer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    PROVIDER = 'WYZIE';
                    _a.trys.push([0, 7, , 8]);

                    // âââ 1. ØªØ­Ø¯ÙØ¯ Ø§ÙÙ ID (ÙÙØ¨Ù tmdb Ø£Ù imdb) âââ
                    id = movieInfo.imdb_id || movieInfo.tmdb_id;
                    if (!id) {
                        libs.log({}, PROVIDER, 'NO_ID');
                        return [2];
                    }

                    // âââ 2. Ø¨ÙØ§Ø¡ query string âââ
                    queryStr = 'id=' + id;
                    if (movieInfo.type === 'tv') {
                        queryStr += '&season=' + movieInfo.season + '&episode=' + movieInfo.episode;
                    }

                    // âââ 3. ÙØ§Ø¦ÙØ© Ø§ÙÙ endpoints ÙØ¹ fallback âââ
                    urls = [
                        // proxy Ø¹Ø¨Ø± 111movies (ÙØ¬Ø§ÙÙØ Ø¨ÙØ§ key)
                        'https://111movies.net/wyzie?' + queryStr
                        // ÙÙÙÙ Ø¥Ø¶Ø§ÙØ©:
                        // 'https://OTHER-PROXY.com/wyzie?' + queryStr,
                        // 'https://sub.wyzie.io/search?' + queryStr + '&key=YOUR_KEY'
                    ];

                    _i = 0;
                    urls_1 = urls;
                    _a.label = 1;

                case 1:
                    if (_i >= urls_1.length) return [3, 6];
                    urlEntry = urls_1[_i];
                    libs.log({ url: urlEntry }, PROVIDER, 'TRY');
                    _a.label = 2;

                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, libs.request_get(urlEntry, {
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
                        'Referer': 'https://111movies.net/',
                        'Accept': 'application/json'
                    })];

                case 3:
                    response = _a.sent();
                    data = null;
                    if (typeof response === 'string') {
                        try { data = JSON.parse(response); } catch (e) { /* not JSON */ }
                    } else {
                        data = response;
                    }

                    if (!Array.isArray(data) || data.length === 0) {
                        libs.log({ urlEntry: urlEntry, gotType: typeof response }, PROVIDER, 'NO_DATA');
                        return [3, 5];  // Ø¬Ø±ÙØ¨ Ø§ÙØªØ§ÙÙ
                    }

                    subList = data;
                    libs.log({ count: subList.length }, PROVIDER, 'GOT_SUBS');

                    // âââ 4. Ø¥Ø±Ø³Ø§Ù ÙÙ ØªØ±Ø¬ÙØ© Ø¹Ø¨Ø± callback âââ
                    for (var j = 0; j < subList.length; j++) {
                        sub = subList[j];
                        if (!sub || !sub.url) continue;
                        label = sub.display || sub.language || 'Unknown';
                        callback({
                            file: sub.url,
                            label: label,
                            lang: sub.language || 'unk',
                            kind: 'captions',
                            format: 'srt',
                            source: 'wyzie',
                            encoding: sub.encoding || 'UTF-8'
                        });
                    }
                    return [3, 6];  // ÙØ¬Ø­Ø ÙØ§ Ø­Ø§Ø¬Ø© ÙÙÙ fallback

                case 4:
                    _a.sent();  // catch
                    libs.log({ url: urlEntry }, PROVIDER, 'URL_FAILED');
                    return [3, 5];

                case 5:
                    _i++;
                    return [3, 1];

                case 6:
                    return [2];

                case 7:
                    e_outer = _a.sent();
                    libs.log({ e: e_outer && e_outer.message ? e_outer.message : String(e_outer) }, PROVIDER, 'FATAL');
                    return [3, 8];

                case 8: return [2];
            }
        });
    });
};
