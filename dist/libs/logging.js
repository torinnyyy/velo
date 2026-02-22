// ══════════════════════════════════════════════════════════════════════
// نظام اللوج المكثف لـ Velo — JSC-Compatible (بدون Node.js)
// ══════════════════════════════════════════════════════════════════════
(function () {

    // ──────────────────────────────────────────────────────────────────
    // Circular buffer — آخر 1000 إدخال فقط (لتجنب memory leak)
    // ──────────────────────────────────────────────────────────────────
    var MAX_ENTRIES = 1000;
    var _buf = [];

    function _ts() {
        var d = new Date();
        var p = function (n) { return n < 10 ? '0' + n : '' + n; };
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
            ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) +
            '.' + (d.getMilliseconds() < 100 ? '0' : '') + (d.getMilliseconds() < 10 ? '0' : '') + d.getMilliseconds();
    }

    function _push(entry) {
        _buf.push(entry);
        if (_buf.length > MAX_ENTRIES) _buf.shift();
    }

    // ──────────────────────────────────────────────────────────────────
    // تحديد level من نص prefix تلقائياً
    // ──────────────────────────────────────────────────────────────────
    function _detectLevel(prefix, subfix) {
        var txt = (String(prefix || '') + ' ' + String(subfix || '')).toLowerCase();
        if (txt.indexOf('error') !== -1 || txt.indexOf('fail') !== -1 || txt.indexOf('خطأ') !== -1) return 'ERROR';
        if (txt.indexOf('warn') !== -1 || txt.indexOf('timeout') !== -1) return 'WARN';
        if (txt.indexOf('success') !== -1 || txt.indexOf('direct url') !== -1 || txt.indexOf('callback') !== -1) return 'SUCCESS';
        return 'INFO';
    }

    // ──────────────────────────────────────────────────────────────────
    // Provider health tracking
    // ──────────────────────────────────────────────────────────────────
    var _stats = {};

    function _track(name, ok, ms) {
        if (!name) return;
        if (!_stats[name]) _stats[name] = { ok: 0, fail: 0, ms: 0, calls: 0 };
        var s = _stats[name];
        if (ok) s.ok++; else s.fail++;
        if (typeof ms === 'number') { s.ms += ms; s.calls++; }
    }

    function _healthReport() {
        var keys = Object.keys(_stats);
        if (!keys.length) { console.log('[HEALTH] No data yet'); return; }
        console.log('[HEALTH] ════ Provider Health Report [' + _ts() + '] ════');
        for (var i = 0; i < keys.length; i++) {
            var n = keys[i], s = _stats[n];
            var total = s.ok + s.fail;
            var rate = total ? ((s.ok / total) * 100).toFixed(1) : '0.0';
            var avg = s.calls ? (s.ms / s.calls).toFixed(0) : 'N/A';
            console.log('[HEALTH]   ' + n + ' | OK=' + s.ok + ' FAIL=' + s.fail + ' Rate=' + rate + '% AvgMs=' + avg);
        }
        console.log('[HEALTH] ═══════════════════════════════════════════════');
    }

    // ──────────────────────────────────────────────────────────────────
    // libs.log — الواجهة الأصلية (لا تغيير في signature)
    // تُضاف: timestamp + level + حفظ في buffer + لوج منظم
    // ──────────────────────────────────────────────────────────────────
    libs.log = function (data, prefix, subfix) {
        var ts = _ts();
        var level = _detectLevel(prefix, subfix);
        var provider = String(prefix || '');
        var tag = String(subfix || '');

        // الإخراج الأصلي — لم يتغير أبداً
        console.log(data, '----- ' + prefix + ' ' + subfix + ' ----');

        // إخراج إضافي منظم مع timestamp ومستوى
        var meta = '[' + ts + '] [' + level + '] [' + provider + '] ' + tag;
        if (level === 'ERROR') {
            console.error(meta, data);
        } else if (level === 'WARN') {
            console.warn(meta, data);
        } else {
            console.log(meta, data);
        }

        // حفظ في buffer
        _push({
            ts: ts,
            level: level,
            provider: provider,
            tag: tag,
            data: data
        });

        // auto-track provider health من نوع السجل
        if (level === 'ERROR' || level === 'WARN') {
            _track(provider, false, null);
        } else if (level === 'SUCCESS' || tag.toLowerCase().indexOf('direct url') !== -1 || tag.toLowerCase().indexOf('embed callback') !== -1) {
            _track(provider, true, null);
        }
    };

    // ──────────────────────────────────────────────────────────────────
    // libs.logger — واجهة منظمة للاستخدام المباشر من providers جديدة
    // ──────────────────────────────────────────────────────────────────
    libs.logger = {

        info: function (msg, meta) {
            var ts = _ts();
            var out = '[' + ts + '] [INFO]' + (meta && meta.provider ? ' [' + meta.provider + ']' : '') + ' ' + msg;
            console.log(out, meta || '');
            _push({ ts: ts, level: 'INFO', message: msg, meta: meta || {} });
        },

        warn: function (msg, meta) {
            var ts = _ts();
            var out = '[' + ts + '] [WARN]' + (meta && meta.provider ? ' [' + meta.provider + ']' : '') + ' ' + msg;
            console.warn(out, meta || '');
            _push({ ts: ts, level: 'WARN', message: msg, meta: meta || {} });
        },

        error: function (msg, meta) {
            var ts = _ts();
            var out = '[' + ts + '] [ERROR]' + (meta && meta.provider ? ' [' + meta.provider + ']' : '') + ' ' + msg;
            console.error(out, meta || '');
            _push({ ts: ts, level: 'ERROR', message: msg, meta: meta || {} });
        },

        success: function (msg, meta) {
            var ts = _ts();
            var out = '[' + ts + '] [SUCCESS]' + (meta && meta.provider ? ' [' + meta.provider + ']' : '') + ' ' + msg;
            console.log(out, meta || '');
            _push({ ts: ts, level: 'SUCCESS', message: msg, meta: meta || {} });
            if (meta && meta.provider) _track(meta.provider, true, meta.ms || null);
        },

        // تتبع نجاح/فشل provider يدوياً
        // مثال: var t = Date.now(); ... libs.logger.track('vidsrc', !!result, Date.now()-t);
        track: _track,

        // استرجاع تقرير الصحة
        getReport: function () { return _stats; },
        printReport: _healthReport,

        // استرجاع سجل اللوج
        getLogs: function (level) {
            if (!level) return _buf.slice();
            var l = level.toUpperCase();
            return _buf.filter(function (e) { return e.level === l; });
        },

        clearLogs: function () { _buf = []; },

        // مستوى اللوج الحالي (للعرض فقط — كل المستويات مفعلة دائماً في النمط المكثف)
        getCount: function () { return _buf.length; }
    };

    // ──────────────────────────────────────────────────────────────────
    // تقرير صحة تلقائي كل 30 دقيقة
    // ──────────────────────────────────────────────────────────────────
    setInterval(_healthReport, 30 * 60 * 1000);

    console.log('[VELO] Logging system initialized — buffer max=' + MAX_ENTRIES + ' | ' + _ts());

})();
