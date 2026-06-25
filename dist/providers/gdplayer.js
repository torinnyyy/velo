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

source.getResource = function (movieInfo, config, callback) { return __awaiter(_this, void 0, void 0, function () {
    var PROVIDER, WORKER, urlApi, headers, response, data, streams, allSubs,
        i, item, streamSubs, mergedSubs, qualities, type, error_1;

    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROVIDER = 'GGDPLAYER';
                WORKER   = 'https://gd-stream.YOUR-SUBDOMAIN.workers.dev';

                _a.trys.push([0, 3, , 4]);

                urlApi = WORKER + '/api/v1/stream?tmdb_id=' + movieInfo.tmdb_id
                       + '&type=' + (movieInfo.type || 'movie');
                if (movieInfo.type === 'tv') {
                    urlApi += '&season=' + movieInfo.season + '&episode=' + movieInfo.episode;
                }
                if (movieInfo.imdb_id) {
                    urlApi += '&imdb_id=' + movieInfo.imdb_id;
                }

                headers = {
                    'accept': 'application/json',
                    'user-agent': libs.request_getRandomUserAgent()
                };

                libs.log({ urlApi: urlApi }, PROVIDER, 'REQUEST');
                return [4, libs.request_get(urlApi, headers)];

            case 1:
                response = _a.sent();

                if (typeof response === 'string') {
                    try { data = JSON.parse(response); } catch (e) { data = null; }
                } else {
                    data = response;
                }

                if (!data || data.status !== 'ok') {
                    libs.log({ response: response }, PROVIDER, 'BAD RESPONSE');
                    return [2, false];
                }

                streams = data.streams || [];
                allSubs = data.subs || [];

                libs.log({
                    streams_count: streams.length,
                    subs_count: allSubs.length,
                    took_ms: data.took_ms
                }, PROVIDER, 'DATA RECEIVED');

                if (!streams.length) {
                    return [2, false];
                }

                i = 0;
                _a.label = 2;

            case 2:
                if (i >= streams.length) { return [3, 4]; }

                item = streams[i];

                streamSubs = (item.subs || []).map(function (s) {
                    return { file: s.file, label: s.label || s.lang || 'Unknown', kind: 'captions' };
                });
                mergedSubs = streamSubs.concat(
                    allSubs.map(function (s) {
                        return { file: s.file, label: s.label || s.lang || 'Unknown', kind: 'captions' };
                    })
                );

                qualities = item.direct_quality && item.direct_quality.length
                    ? item.direct_quality
                    : [{ file: item.file, quality: item.quality || '1080' }];

                type = (item.type || 'Hls');

                libs.embed_callback(
                    item.file,
                    PROVIDER,
                    item.host || PROVIDER,
                    type,
                    callback,
                    i + 1,
                    mergedSubs,
                    qualities,
                    item.headers || {}
                );

                i++;
                return [3, 2];

            case 3:
                error_1 = _a.sent();
                libs.log({ e: error_1 && error_1.message ? error_1.message : error_1 },
                         PROVIDER, 'ERROR');
                return [3, 4];

            case 4: return [2, true];
        }
    });
}); };
