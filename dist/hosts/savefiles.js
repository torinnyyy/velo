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

// SaveFiles Host — savefiles.com
// Extraction method (confirmed by live test):
//   1. GET /e/{code} → shows embed page with form (file_code field, action="/dl")
//   2. POST /dl with: op=embed&file_code={code}&auto=1&referer={referer}
//   3. Response HTML contains Clappr player with m3u8 URL:
//      https://s{N}.savefiles.com/hls2/.../master.m3u8?...
//
// URL patterns from asd.pics:
//   https://savefiles.com/e/c14xsbiqod0w
hosts["savefiles"] = function (url, movieInfo, provider, config, callback) { return __awaiter(_this, void 0, void 0, function () {
    var HOST, DOMAIN, UA, m, filecode, postBody, html, videoUrl, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                HOST   = 'SaveFiles';
                DOMAIN = 'https://savefiles.com';
                UA     = libs.request_getRandomUserAgent();
                libs.log({ url: url }, HOST, 'START');
                _a.label = 1;

            case 1:
                _a.trys.push([1, 3, , 4]);

                // Extract file code from URL
                // Patterns: /e/{code}  OR  /embed-{code}.html
                m = url.match(/\/e\/([A-Za-z0-9]+)/) ||
                    url.match(/embed-([A-Za-z0-9]+)(?:\.html)?/);

                filecode = m ? m[1] : null;
                libs.log({ filecode: filecode }, HOST, 'FILECODE');

                if (!filecode) {
                    libs.log({ url: url }, HOST, 'NO FILECODE');
                    return [2];
                }

                // POST to /dl — response is HTML with embedded Clappr player containing m3u8
                postBody = 'op=embed&file_code=' + filecode + '&auto=1&referer=' + encodeURIComponent('https://asd.pics/');
                libs.log({ postBody: postBody }, HOST, 'POST');
                return [4, libs.request_post(
                    DOMAIN + '/dl',
                    {
                        'user-agent':   UA,
                        'Referer':      url,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Origin':       DOMAIN
                    },
                    postBody
                )];

            case 2:
                html = _a.sent();
                if (typeof html !== 'string') {
                    libs.log({ url: url }, HOST, 'BLOCKED');
                    return [2];
                }

                // Extract m3u8 from response HTML
                // Clappr player or direct script contains the URL
                m = html.match(/https?:\/\/[^"'<>\s]+\.m3u8[^"'<>\s]*/);
                videoUrl = m ? m[0] : null;
                libs.log({ videoUrl: videoUrl }, HOST, 'EXTRACTED');

                if (!videoUrl) {
                    libs.log({ url: url }, HOST, 'NO URL');
                    return [2];
                }

                libs.embed_callback(
                    videoUrl,
                    provider,
                    HOST,
                    'Hls',
                    callback,
                    1,
                    [],
                    [{ file: videoUrl, quality: 1080 }],
                    {
                        'Referer':    DOMAIN + '/',
                        'user-agent': UA
                    }
                );
                return [3, 4];

            case 3:
                e_1 = _a.sent();
                libs.log({ e: e_1.message || e_1 }, HOST, 'ERROR');
                return [3, 4];

            case 4: return [2];
        }
    });
}); };
