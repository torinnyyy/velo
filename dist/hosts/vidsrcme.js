/**
 * VidSrc.me Video Extractor
 * مستخرج فيديوهات من VidSrc.me
 * 
 * @version 1.0.0
 * @author Universal Video Downloader
 */

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

/**
 * VidSrc.me Extractor Handler
 * معالج استخراج من VidSrc.me
 */
hosts["vidsrcme"] = function (url, movieInfo, provider, config, callback) { return __awaiter(_this, void 0, void 0, function () {
    var DOMAIN, HOST, imdbId, season, episode, embedUrl, headers, htmlContent, iframeSources, allSources, i, iframeUrl, m3u8Data, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                DOMAIN = 'https://vidsrc.me';
                HOST = 'vidsrcme';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                imdbId = void 0, season = void 0, episode = void 0;
                // استخراج IMDB ID من الرابط
                if (url.includes('/embed/movie/')) {
                    imdbId = url.match(/\/embed\/movie\/(tt\d+)/i);
                    imdbId = imdbId ? imdbId[1] : null;
                } else if (url.includes('/embed/tv/')) {
                    // مثال: /embed/tv/tt1234567/1/2
                    var tvMatch = url.match(/\/embed\/tv\/(tt\d+)\/(\d+)\/(\d+)/i);
                    if (tvMatch) {
                        imdbId = tvMatch[1];
                        season = tvMatch[2];
                        episode = tvMatch[3];
                    }
                } else {
                    // محاولة استخراج من الرابط العادي
                    imdbId = url.match(/(tt\d+)/i);
                    imdbId = imdbId ? imdbId[1] : null;
                }
                
                libs.log({ imdbId: imdbId, season: season, episode: episode }, HOST, "معرفات الفيديو");
                
                if (!imdbId) {
                    libs.log({ url: url }, HOST, "خطأ: لم يتم العثور على IMDB ID");
                    return [2 /*return*/];
                }
                
                // بناء رابط embed
                if (season && episode) {
                    embedUrl = DOMAIN + "/embed/tv/" + imdbId + "/" + season + "/" + episode;
                } else {
                    embedUrl = DOMAIN + "/embed/movie/" + imdbId;
                }
                
                libs.log({ embedUrl: embedUrl }, HOST, "رابط Embed");
                
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': DOMAIN + '/',
                    'Origin': DOMAIN,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                };
                
                return [4 /*yield*/, libs.request_get(embedUrl, headers)];
            case 2:
                htmlContent = _a.sent();
                
                libs.log({ htmlLength: htmlContent.length }, HOST, "تم جلب HTML");
                
                iframeSources = extractIframeSources(htmlContent);
                
                libs.log({ sourcesCount: iframeSources.length, sources: iframeSources }, HOST, "مصادر Iframe");
                
                if (iframeSources.length === 0) {
                    libs.log({}, HOST, "خطأ: لم يتم العثور على مصادر iframe");
                    return [2 /*return*/];
                }
                
                allSources = [];
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < iframeSources.length)) return [3 /*break*/, 6];
                iframeUrl = iframeSources[i];
                
                libs.log({ iframeUrl: iframeUrl }, HOST, "معالجة iframe " + (i + 1));
                
                return [4 /*yield*/, extractM3U8FromIframe(iframeUrl, headers, libs, HOST)];
            case 4:
                m3u8Data = _a.sent();
                
                if (m3u8Data && m3u8Data.url) {
                    allSources.push(m3u8Data);
                    libs.log({ m3u8Url: m3u8Data.url }, HOST, "تم استخراج M3U8 بنجاح");
                }
                
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                
                if (allSources.length === 0) {
                    libs.log({}, HOST, "خطأ: لم يتم العثور على روابط M3U8");
                    return [2 /*return*/];
                }
                
                // إرجاع أفضل مصدر
                var bestSource = allSources[0];
                
                libs.embed_callback(
                    bestSource.url,
                    provider,
                    HOST,
                    'Hls',
                    callback,
                    1,
                    bestSource.subtitles || [],
                    allSources.map(function(source) {
                        return {
                            file: source.url,
                            quality: source.quality || 1080,
                            label: source.source || 'Unknown'
                        };
                    })
                );
                
                return [3 /*break*/, 8];
            case 7:
                e_1 = _a.sent();
                libs.log({ error: e_1.message, stack: e_1.stack }, HOST, "خطأ");
                return [3 /*break*/, 8];
            case 8:
                return [2 /*return*/];
        }
    });
}); };

/**
 * استخراج مصادر iframe من HTML
 */
function extractIframeSources(html) {
    var sources = [];
    
    // Pattern 1: iframe src
    var iframePattern = /<iframe[^>]+src=["']([^"']+)["']/gi;
    var matches = html.matchAll(iframePattern);
    
    for (var match of matches) {
        var src = match[1];
        
        // تنظيف الرابط
        if (src.startsWith('//')) {
            src = 'https:' + src;
        } else if (src.startsWith('/')) {
            src = 'https://vidsrc.me' + src;
        }
        
        // تجاهل iframe غير مهم
        if (!src.includes('vidsrc') && 
            !src.includes('embed') && 
            !src.includes('player') &&
            !src.includes('stream')) {
            continue;
        }
        
        sources.push(src);
    }
    
    // Pattern 2: data-src attribute
    var dataSrcPattern = /<iframe[^>]+data-src=["']([^"']+)["']/gi;
    matches = html.matchAll(dataSrcPattern);
    
    for (var match of matches) {
        var src = match[1];
        
        if (src.startsWith('//')) {
            src = 'https:' + src;
        } else if (src.startsWith('/')) {
            src = 'https://vidsrc.me' + src;
        }
        
        sources.push(src);
    }
    
    // إزالة التكرار
    return Array.from(new Set(sources));
}

/**
 * استخراج رابط M3U8 من iframe
 */
function extractM3U8FromIframe(iframeUrl, headers, libs, HOST) {
    return __awaiter(this, void 0, void 0, function () {
        var iframeHeaders, iframeHtml, m3u8Url, jsonMatch, jsMatch, dataMatch, apiMatch, apiUrl, apiData, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    
                    iframeHeaders = Object.assign({}, headers);
                    iframeHeaders['Referer'] = iframeUrl;
                    
                    return [4 /*yield*/, libs.request_get(iframeUrl, iframeHeaders)];
                case 1:
                    iframeHtml = _a.sent();
                    
                    m3u8Url = null;
                    
                    // محاولة 1: JSON في JavaScript
                    jsonMatch = iframeHtml.match(/"file"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
                    if (jsonMatch) {
                        m3u8Url = cleanM3U8Url(jsonMatch[1]);
                        libs.log({ method: 'JSON', url: m3u8Url }, HOST, "وجدنا M3U8");
                    }
                    
                    // محاولة 2: JavaScript variable
                    if (!m3u8Url) {
                        jsMatch = iframeHtml.match(/(?:source|file|url)\s*=\s*["']([^"']+\.m3u8[^"']*)["']/i);
                        if (jsMatch) {
                            m3u8Url = cleanM3U8Url(jsMatch[1]);
                            libs.log({ method: 'JS Variable', url: m3u8Url }, HOST, "وجدنا M3U8");
                        }
                    }
                    
                    // محاولة 3: Data attributes
                    if (!m3u8Url) {
                        dataMatch = iframeHtml.match(/data-(?:url|file|source)\s*=\s*["']([^"']+\.m3u8[^"']*)["']/i);
                        if (dataMatch) {
                            m3u8Url = cleanM3U8Url(dataMatch[1]);
                            libs.log({ method: 'Data Attribute', url: m3u8Url }, HOST, "وجدنا M3U8");
                        }
                    }
                    
                    // محاولة 4: API endpoint مخفي
                    if (!m3u8Url) {
                        apiMatch = iframeHtml.match(/fetch\(["']([^"']+)["']/i);
                        if (apiMatch) {
                            apiUrl = apiMatch[1];
                            
                            if (apiUrl.startsWith('/')) {
                                var urlObj = new URL(iframeUrl);
                                apiUrl = urlObj.origin + apiUrl;
                            }
                            
                            libs.log({ apiUrl: apiUrl }, HOST, "محاولة API call");
                            
                            return [4 /*yield*/, libs.request_get(apiUrl, iframeHeaders)];
                        case 2:
                            apiData = _a.sent();
                            
                            if (typeof apiData === 'string') {
                                try {
                                    apiData = JSON.parse(apiData);
                                } catch (e) {
                                    // ignore
                                }
                            }
                            
                            if (apiData && apiData.file) {
                                m3u8Url = cleanM3U8Url(apiData.file);
                                libs.log({ method: 'API', url: m3u8Url }, HOST, "وجدنا M3U8");
                            }
                        }
                    }
                    
                    _a.label = 3;
                case 3:
                    
                    if (!m3u8Url) {
                        libs.log({}, HOST, "لم نجد M3U8 في iframe");
                        return [2 /*return*/, null];
                    }
                    
                    // استخراج الترجمات
                    var subtitles = extractSubtitles(iframeHtml);
                    
                    return [2 /*return*/, {
                        url: m3u8Url,
                        source: identifySource(iframeUrl),
                        quality: 1080,
                        subtitles: subtitles
                    }];
                    
                case 4:
                    e_2 = _a.sent();
                    libs.log({ error: e_2.message }, HOST, "خطأ في استخراج M3U8");
                    return [2 /*return*/, null];
                    
                case 5:
                    return [2 /*return*/];
            }
        });
    });
}

/**
 * تنظيف رابط M3U8
 */
function cleanM3U8Url(url) {
    // فك URL encoding
    url = decodeURIComponent(url);
    
    // إزالة escape characters
    url = url.replace(/\\+/g, '');
    url = url.replace(/\\\//g, '/');
    
    // التأكد من البروتوكول
    if (url.startsWith('//')) {
        url = 'https:' + url;
    } else if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    
    return url;
}

/**
 * استخراج الترجمات من HTML
 */
function extractSubtitles(html) {
    var subtitles = [];
    
    try {
        // Pattern للترجمات
        var subPattern = /"label"\s*:\s*"([^"]+)"[^}]*"file"\s*:\s*"([^"]+\.vtt[^"]*)"/gi;
        var matches = html.matchAll(subPattern);
        
        for (var match of matches) {
            var label = match[1];
            var file = match[2];
            
            subtitles.push({
                language: label,
                file: cleanM3U8Url(file),
                format: 'vtt'
            });
        }
    } catch (e) {
        // ignore subtitle errors
    }
    
    return subtitles;
}

/**
 * تحديد مصدر الفيديو
 */
function identifySource(url) {
    if (url.includes('vidsrc.stream') || url.includes('vidsrc.pro')) {
        return 'VidSrc PRO';
    } else if (url.includes('multiembed') || url.includes('superembed')) {
        return 'Superembed';
    } else if (url.includes('vidplay')) {
        return 'Vidplay';
    } else if (url.includes('filemoon')) {
        return 'Filemoon';
    } else {
        return 'Unknown';
    }
}

/**
 * مثال على الاستخدام:
 * 
 * // للأفلام
 * hosts["vidsrcme"]('https://vidsrc.me/embed/movie/tt1234567', {}, 'vidsrcme', {}, function(result) {
 *     console.log('Video extracted:', result);
 * });
 * 
 * // للمسلسلات
 * hosts["vidsrcme"]('https://vidsrc.me/embed/tv/tt7654321/1/5', {}, 'vidsrcme', {}, function(result) {
 *     console.log('Episode extracted:', result);
 * });
 */
