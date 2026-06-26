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
// 2EMBEDCC â Embed URL Provider (DHFLIX)
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// Strategy: returns embed URL instead of extracting m3u8.
// HTTP scraping no longer works (Cloudflare Turnstile).
// The RN app opens the embed URL in HiddenWebViewExtractor which
// solves Turnstile automatically and captures the real m3u8.
//
// PROVIDER_ID:  PTOWEMBEDCC
// Display Name: 2Embed
// Source:       https://www.2embed.cc
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
source.getResource = function (movieInfo, config, callback) {
  return __awaiter(_this, void 0, void 0, function () {
    var PROVIDER, DOMAINS, embedUrl, _di;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          PROVIDER = 'PTOWEMBEDCC';
          DOMAINS = ["https://www.2embed.cc"];
          _di = 0;

          embedUrl = movieInfo.type === 'tv'
            ? DOMAINS[_di] + "/embedtv/" + movieInfo.tmdb_id + "&s=" + movieInfo.season + "&e=" + movieInfo.episode + ""
            : DOMAINS[_di] + "/embed/" + movieInfo.tmdb_id + "";

          libs.log({ embedUrl: embedUrl, type: movieInfo.type }, PROVIDER, 'EMBED');

          libs.embed_callback(
            embedUrl,
            PROVIDER,
            '2Embed',
            'embed',  // â WebView will extract real m3u8
            callback,
            1,
            [],       // subs (captured by WebView)
            [],       // qualities (captured by WebView)
            {
              'Referer': DOMAINS[_di] + '/',
              'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
            }
          );

          return [2, true];
      }
    });
  });
};
