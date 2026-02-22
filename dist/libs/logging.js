// ════════════════════════════════════════════════════════════════════
// نظام اللوج المركزي لـ Velo
// ════════════════════════════════════════════════════════════════════
//
// ⚠️ ملاحظة تقنية مهمة:
// هذا الكود يعمل داخل JavaScriptCore (JSC) في React Native.
// JSC لا يدعم Node.js APIs (fs, path, stream) لذلك لا يمكن استخدام
// مكتبات مثل winston مباشرة.
// الحل: نظام لوج خفيف الوزن 100% متوافق مع JSC.
//
// الميزات:
//   1. libs.log()       — نفس الواجهة القديمة بدون أي تغيير (backward compatible)
//   2. libs.logger      — واجهة جديدة: info / warn / error / success
//   3. libs.logger.trackProvider() — تتبع نجاح/فشل كل provider
//   4. libs.logger.getHealthReport() — تقرير صحة الـ providers
//   5. libs.logger.getLogs()        — استرجاع سجل الـ logs المخزنة
//
// ════════════════════════════════════════════════════════════════════

(function () {

    // ────────────────────────────────────────────────────────────────
    // إعدادات
    // ────────────────────────────────────────────────────────────────
    var MAX_LOG_ENTRIES = 500;   // الحد الأقصى للإدخالات المحفوظة في الذاكرة
    var LOG_LEVEL = 'info';      // 'info' | 'warn' | 'error'

    var LEVELS = { info: 0, warn: 1, error: 2, success: 0 };

    // ────────────────────────────────────────────────────────────────
    // مخزن اللوج (Circular Buffer في الذاكرة)
    // ────────────────────────────────────────────────────────────────
    var logBuffer = [];

    function getTimestamp() {
        var now = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        return now.getFullYear() + '-' +
            pad(now.getMonth() + 1) + '-' +
            pad(now.getDate()) + ' ' +
            pad(now.getHours()) + ':' +
            pad(now.getMinutes()) + ':' +
            pad(now.getSeconds());
    }

    function addToBuffer(entry) {
        logBuffer.push(entry);
        // احتفظ بآخر MAX_LOG_ENTRIES فقط لتجنب استهلاك الذاكرة
        if (logBuffer.length > MAX_LOG_ENTRIES) {
            logBuffer.shift();
        }
    }

    // ────────────────────────────────────────────────────────────────
    // الوظيفة الأساسية للكتابة
    // ────────────────────────────────────────────────────────────────
    function writeLog(level, message, meta) {
        var currentLevelValue = LEVELS[LOG_LEVEL] !== undefined ? LEVELS[LOG_LEVEL] : 0;
        var entryLevelValue   = LEVELS[level]     !== undefined ? LEVELS[level]     : 0;

        // تجاهل المستويات الأدنى من الإعداد الحالي
        if (entryLevelValue < currentLevelValue) return;

        var entry = {
            timestamp: getTimestamp(),
            level: level,
            message: message,
        };

        if (meta && typeof meta === 'object') {
            // نسخ المعطيات بدون تعديل الأصل
            entry.provider    = meta.provider    || undefined;
            entry.url         = meta.url         || undefined;
            entry.statusCode  = meta.statusCode  || undefined;
            entry.error       = meta.error       || undefined;
            entry.stack       = meta.stack       || undefined;
        }

        addToBuffer(entry);

        // طباعة في الـ console بتنسيق موحد
        var prefix = '[' + entry.timestamp + '] [' + level.toUpperCase() + ']';
        if (entry.provider) prefix += ' [' + entry.provider + ']';

        if (level === 'error') {
            console.error(prefix, message, meta || '');
        } else if (level === 'warn') {
            console.warn(prefix, message, meta || '');
        } else {
            console.log(prefix, message, meta || '');
        }
    }

    // ────────────────────────────────────────────────────────────────
    // تتبع صحة الـ Providers (Provider Health Tracking)
    // ────────────────────────────────────────────────────────────────
    var providerStats = {};

    function trackProvider(providerName, success, responseTimeMs) {
        if (!providerStats[providerName]) {
            providerStats[providerName] = { success: 0, fail: 0, totalTime: 0, calls: 0 };
        }
        var stat = providerStats[providerName];
        if (success) {
            stat.success++;
        } else {
            stat.fail++;
        }
        if (typeof responseTimeMs === 'number') {
            stat.totalTime += responseTimeMs;
            stat.calls++;
        }
    }

    function getHealthReport() {
        var report = [];
        var names = Object.keys(providerStats);
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var stat = providerStats[name];
            var total = stat.success + stat.fail;
            var rate = total > 0 ? ((stat.success / total) * 100).toFixed(1) : '0.0';
            var avgTime = stat.calls > 0 ? (stat.totalTime / stat.calls).toFixed(0) : 'N/A';
            report.push({
                provider: name,
                successRate: rate + '%',
                success: stat.success,
                fail: stat.fail,
                avgResponseTime: avgTime + 'ms'
            });
        }
        return report;
    }

    function printHealthReport() {
        var report = getHealthReport();
        console.log('════ تقرير صحة الـ Providers [' + getTimestamp() + '] ════');
        if (report.length === 0) {
            console.log('  (لا توجد بيانات بعد)');
            return;
        }
        for (var i = 0; i < report.length; i++) {
            var r = report[i];
            console.log(
                '  ' + r.provider + ': نجاح=' + r.success +
                ' فشل=' + r.fail +
                ' معدل النجاح=' + r.successRate +
                ' متوسط الوقت=' + r.avgResponseTime
            );
        }
        console.log('═══════════════════════════════════════════════════');
    }

    // ────────────────────────────────────────────────────────────────
    // الواجهة العامة: libs.logger
    // ────────────────────────────────────────────────────────────────
    libs.logger = {
        // تسجيل معلومات عامة
        // مثال: libs.logger.info('جاري الاستخراج', { provider: 'okru', url: url })
        info: function (message, meta) {
            writeLog('info', message, meta);
        },

        // تسجيل تحذير
        // مثال: libs.logger.warn('فشل المحاولة', { provider: 'okru', error: err.message })
        warn: function (message, meta) {
            writeLog('warn', message, meta);
        },

        // تسجيل خطأ
        // مثال: libs.logger.error('فشل الطلب', { provider: 'okru', url: url, error: err.message, statusCode: 403 })
        error: function (message, meta) {
            writeLog('error', message, meta);
        },

        // تسجيل نجاح (نفس مستوى info)
        // مثال: libs.logger.success('تم استخراج الرابط', { provider: 'okru', url: url })
        success: function (message, meta) {
            writeLog('success', message, meta);
        },

        // ── تتبع صحة الـ providers ──────────────────────────────────
        // الاستخدام:
        //   var start = Date.now();
        //   var result = await extractFromProvider(provider, url);
        //   libs.logger.trackProvider(provider, !!result, Date.now() - start);
        trackProvider: trackProvider,

        // ── استرجاع تقرير صحة الـ providers ────────────────────────
        // يُرجع: مصفوفة من { provider, successRate, success, fail, avgResponseTime }
        getHealthReport: getHealthReport,

        // ── طباعة تقرير الصحة في الـ console ───────────────────────
        printHealthReport: printHealthReport,

        // ── استرجاع سجلات محفوظة في الذاكرة ────────────────────────
        // الاستخدام: libs.logger.getLogs('error') → آخر 500 إدخال من نوع error
        //            libs.logger.getLogs()         → كل الإدخالات
        getLogs: function (levelFilter) {
            if (!levelFilter) return logBuffer.slice();
            return logBuffer.filter(function (e) { return e.level === levelFilter; });
        },

        // ── مسح سجل الأخطاء من الذاكرة ──────────────────────────────
        clearLogs: function () {
            logBuffer = [];
        },

        // ── ضبط مستوى اللوج ─────────────────────────────────────────
        // الاستخدام: libs.logger.setLevel('error') لإظهار الأخطاء فقط
        setLevel: function (level) {
            if (LEVELS[level] !== undefined) {
                LOG_LEVEL = level;
            }
        }
    };

    // ────────────────────────────────────────────────────────────────
    // libs.log — نفس الواجهة القديمة تماماً (Backward Compatible)
    // الكود القديم يعمل بدون أي تعديل
    // ────────────────────────────────────────────────────────────────
    libs.log = function (data, prefix, subfix) {
        // الإخراج القديم: لا تغيير — نفس النص بنفس التنسيق
        console.log(data, "----- ".concat(prefix, " ").concat(subfix, " ----"));

        // بالإضافة: نحفظ في الـ buffer الجديد
        var level = 'info';
        var prefixStr = String(prefix || '');
        if (prefixStr.toLowerCase().indexOf('error') !== -1) {
            level = 'error';
        } else if (prefixStr.toLowerCase().indexOf('warn') !== -1) {
            level = 'warn';
        }

        addToBuffer({
            timestamp: getTimestamp(),
            level: level,
            message: String(subfix || ''),
            provider: prefix || undefined,
            data: data
        });
    };

    // ────────────────────────────────────────────────────────────────
    // تقرير دوري كل 30 دقيقة (اختياري — يطبع في console)
    // ────────────────────────────────────────────────────────────────
    setInterval(function () {
        printHealthReport();
    }, 30 * 60 * 1000);

})();
