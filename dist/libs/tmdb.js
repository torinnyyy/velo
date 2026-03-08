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
libs.tmdb_movie_info = function (id, lang) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(API_KEY, "&language=").concat(lang);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, {
                        title: result.title,
                    }];
        }
    });
}); };
libs.tmdb_tv_info = function (id, lang) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/".concat(id, "?api_key=").concat(API_KEY, "&language=").concat(lang);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                console.log({ result: result }, 'tmdb_tv_info');
                return [2, {
                        title: result.name,
                    }];
        }
    });
}); };

// ─────────────────────────────────────────────────────────────────────────────
// Arabic Content Functions — وظائف المحتوى العربي
// Source: https://developer.themoviedb.org/reference/intro/getting-started
//
// Parameters used:
//   language=ar-SA       → Arabic titles + descriptions (fallback to EN if unavailable)
//   region=SA            → Release dates / availability for Saudi Arabia region
//   with_original_language=ar → Filter content originally produced in Arabic
//   include_image_language=ar,null → Arabic posters + language-neutral backdrops
//
// NOTE: Person names are NOT translated to Arabic (TMDB platform limitation)
// ─────────────────────────────────────────────────────────────────────────────

// ── Movies Arabic ─────────────────────────────────────────────────────────────

// Trending movies today with Arabic metadata
// Endpoint: /3/trending/movie/day?language=ar-SA&region=SA&page={page}
libs.tmdb_movie_trending_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Popular movies with Arabic metadata
// Endpoint: /3/movie/popular?language=ar-SA&region=SA
libs.tmdb_movie_popular_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/popular?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Top rated movies with Arabic metadata
// Endpoint: /3/movie/top_rated?language=ar-SA&region=SA
libs.tmdb_movie_top_rated_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/top_rated?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Upcoming movies with Arabic metadata + SA region release dates
// Endpoint: /3/movie/upcoming?language=ar-SA&region=SA
libs.tmdb_movie_upcoming_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/upcoming?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Now playing movies in Arab region cinemas
// Endpoint: /3/movie/now_playing?language=ar-SA&region=SA
libs.tmdb_movie_now_playing_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/now_playing?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Discover movies originally produced in Arabic (not just translated)
// Endpoint: /3/discover/movie?with_original_language=ar&language=ar-SA&region=SA&sort_by=popularity.desc
libs.tmdb_discover_arabic_movies = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(API_KEY, "&language=ar-SA&with_original_language=ar&region=SA&sort_by=popularity.desc&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Movie details with full Arabic metadata
// Endpoint: /3/movie/{id}?language=ar-SA
libs.tmdb_movie_detail_ar = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(API_KEY, "&language=ar-SA");
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Movie recommendations with Arabic titles
// Endpoint: /3/movie/{id}/recommendations?language=ar-SA
libs.tmdb_movie_recommendations_ar = function (id, page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/".concat(id, "/recommendations?api_key=").concat(API_KEY, "&language=ar-SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Movie images: Arabic posters + language-neutral backdrops
// Endpoint: /3/movie/{id}/images?language=ar&include_image_language=ar,null
libs.tmdb_movie_images_ar = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/movie/".concat(id, "/images?api_key=").concat(API_KEY, "&language=ar&include_image_language=ar,null");
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Search movies and TV in Arabic
// Endpoint: /3/search/multi?query={q}&language=ar-SA&region=SA
libs.tmdb_search_ar = function (query, page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/search/multi?api_key=".concat(API_KEY, "&query=").concat(encodeURIComponent(query), "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// ── TV Shows Arabic ───────────────────────────────────────────────────────────

// Trending TV shows this week with Arabic metadata
// Endpoint: /3/trending/tv/week?language=ar-SA&region=SA
libs.tmdb_tv_trending_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/trending/tv/week?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Popular TV shows with Arabic metadata
// Endpoint: /3/tv/popular?language=ar-SA&region=SA
libs.tmdb_tv_popular_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/popular?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Top rated TV shows with Arabic metadata
// Endpoint: /3/tv/top_rated?language=ar-SA&region=SA
libs.tmdb_tv_top_rated_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/top_rated?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// TV shows airing today with Arabic metadata
// Endpoint: /3/tv/airing_today?language=ar-SA&region=SA
libs.tmdb_tv_airing_today_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/airing_today?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// TV shows currently on air with Arabic metadata
// Endpoint: /3/tv/on_the_air?language=ar-SA&region=SA
libs.tmdb_tv_on_the_air_ar = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/on_the_air?api_key=".concat(API_KEY, "&language=ar-SA&region=SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Discover TV shows originally produced in Arabic
// Endpoint: /3/discover/tv?with_original_language=ar&language=ar-SA&region=SA&sort_by=popularity.desc
libs.tmdb_discover_arabic_tv = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/discover/tv?api_key=".concat(API_KEY, "&language=ar-SA&with_original_language=ar&region=SA&sort_by=popularity.desc&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// TV show details with full Arabic metadata
// Endpoint: /3/tv/{id}?language=ar-SA
libs.tmdb_tv_detail_ar = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/".concat(id, "?api_key=").concat(API_KEY, "&language=ar-SA");
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// TV show recommendations with Arabic titles
// Endpoint: /3/tv/{id}/recommendations?language=ar-SA
libs.tmdb_tv_recommendations_ar = function (id, page) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/".concat(id, "/recommendations?api_key=").concat(API_KEY, "&language=ar-SA&page=").concat(page || 1);
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// TV images: Arabic posters + language-neutral backdrops
// Endpoint: /3/tv/{id}/images?language=ar&include_image_language=ar,null
libs.tmdb_tv_images_ar = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/tv/".concat(id, "/images?api_key=").concat(API_KEY, "&language=ar&include_image_language=ar,null");
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };

// Genre list in Arabic
// Endpoint: /3/genre/{media_type}/list?language=ar-SA
libs.tmdb_genres_ar = function (mediaType) { return __awaiter(_this, void 0, void 0, function () {
    var configData, API_KEY, url, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, libs.request_get("https://raw.githubusercontent.com/lulunnqqq/configs/main/data.json")];
            case 1:
                configData = _a.sent();
                API_KEY = configData.tmdb_apikey.web_key;
                url = "https://api.themoviedb.org/3/genre/".concat(mediaType || 'movie', "/list?api_key=").concat(API_KEY, "&language=ar-SA");
                return [4, libs.request_get(url)];
            case 2:
                result = _a.sent();
                return [2, result];
        }
    });
}); };
