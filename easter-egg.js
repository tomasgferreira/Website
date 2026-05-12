(function () {
    'use strict';

    var SECRET = 'PORSCHE';
    var BUFFER_TIMEOUT_MS = 5000;
    var GLITCH_DURATION_MS = 800;
    var MOBILE_BREAKPOINT = 768;
    var TOTAL_LAPS = 3;
    var MIN_LAP_MS = 8000;
    var MIN_LAP_PROGRESS_RATIO = 0.68;
    var SPLINE_TENSION = 0.65;
    var LEADERBOARD_VISIBLE_MS = 7000;
    var INTRO_VISIBLE_MS = 2200;
    var SUPABASE_CDN_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    var CAR_SPRITE_PATH = 'assets/porsche_easter.png';

    // Supabase project URL.
    var SUPABASE_URL = 'https://ggfnshrqqdbwemzxorsq.supabase.co';
    // Supabase anon key.
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnZm5zaHJxcWRid2VtenhvcnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1OTkzMzksImV4cCI6MjA5NDE3NTMzOX0.7UR0-4N5OpPwyXmR5MDWBn3J0qRmgynlEt-MDaJkXB4';

    // Dense contour traced from the red outline, tuned for "smoothed but close".
    var TRACK_WAYPOINTS = [
        [0.060, 0.505], [0.052, 0.460], [0.048, 0.415], [0.050, 0.365], [0.058, 0.315],
        [0.074, 0.268], [0.100, 0.226], [0.132, 0.194], [0.170, 0.173], [0.210, 0.160],
        [0.252, 0.154], [0.292, 0.154], [0.332, 0.156], [0.362, 0.172], [0.385, 0.205],
        [0.404, 0.248], [0.423, 0.296], [0.447, 0.347], [0.477, 0.392], [0.509, 0.422],
        [0.541, 0.423], [0.569, 0.399], [0.593, 0.357], [0.611, 0.308], [0.632, 0.256],
        [0.657, 0.213], [0.690, 0.183], [0.731, 0.168], [0.772, 0.162], [0.815, 0.158],
        [0.856, 0.169], [0.892, 0.198], [0.921, 0.239], [0.943, 0.287], [0.955, 0.338],
        [0.960, 0.392], [0.960, 0.450], [0.960, 0.512], [0.964, 0.578], [0.968, 0.648],
        [0.968, 0.718], [0.960, 0.781], [0.944, 0.835], [0.918, 0.876], [0.882, 0.903],
        [0.839, 0.918], [0.792, 0.926], [0.744, 0.928], [0.698, 0.929], [0.653, 0.929],
        [0.607, 0.929], [0.560, 0.931], [0.512, 0.933], [0.468, 0.933], [0.424, 0.929],
        [0.382, 0.920], [0.346, 0.900], [0.321, 0.868], [0.304, 0.823], [0.293, 0.769],
        [0.281, 0.715], [0.266, 0.666], [0.245, 0.628], [0.214, 0.603], [0.176, 0.588],
        [0.138, 0.578], [0.103, 0.568], [0.076, 0.548], [0.060, 0.505]
    ];

    var CAR_PATTERN = [
        '....GGGG....',
        '...GGGGGG...',
        '..GGGGGGGG..',
        '.GWWGGGGWWG.',
        '.GWWGGGGWWG.',
        'GGGGGGGGGGGG',
        'GGGGGGGGGGGG',
        'GGGGGGGGGGGG',
        'GGGGGGGGGGGG',
        'GGGGGGGGGGGG',
        'GGGGGGGGGGGG',
        '.GGDDDDDDGG.',
        '.GGDDDDDDGG.',
        '..GGGGGGGG..'
    ];

    var COLORS = {
        green: '#00ff00',
        darkGreen: '#003300',
        bodyDark: '#004400',
        bg: '#0d0d0d',
        track: '#1a1a1a',
        white: '#ffffff',
        black: '#000000'
    };

    var secretBuffer = '';
    var secretTimer = 0;
    var activeSession = null;

    document.addEventListener('keydown', onSecretKeydown);

    function onSecretKeydown(e) {
        if (activeSession) {
            return;
        }

        if (isEditableElement(document.activeElement)) {
            return;
        }

        var key = (e.key || '').toUpperCase();
        if (!/^[A-Z]$/.test(key)) {
            return;
        }

        secretBuffer += key;
        if (secretBuffer.length > SECRET.length) {
            secretBuffer = secretBuffer.slice(-SECRET.length);
        }

        clearTimeout(secretTimer);
        secretTimer = setTimeout(function () {
            secretBuffer = '';
        }, BUFFER_TIMEOUT_MS);

        if (secretBuffer === SECRET) {
            secretBuffer = '';
            triggerEasterEgg();
        }
    }

    function isEditableElement(el) {
        if (!el) {
            return false;
        }
        if (el.isContentEditable) {
            return true;
        }
        var tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    }

    async function triggerEasterEgg() {
        if (activeSession) {
            return;
        }

        var session = createSession();
        activeSession = session;

        try {
            await playBodyGlitch(GLITCH_DURATION_MS);
            session.mount();

            if (window.innerWidth < MOBILE_BREAKPOINT) {
                session.showMobileFallback();
                return;
            }

            await session.ensureSupabaseReady();
            session.recordVisitor();
            session.start();
        } catch (err) {
            console.error('[EasterEgg] Activation failed:', err);
            session.forceCleanup();
        }
    }

    function playBodyGlitch(durationMs) {
        return new Promise(function (resolve) {
            document.body.classList.add('ee-glitch');
            setTimeout(function () {
                document.body.classList.remove('ee-glitch');
                resolve();
            }, durationMs);
        });
    }

    function createSession() {
        var overlay = null;
        var canvas = null;
        var ctx = null;
        var nameInput = null;
        var rafId = 0;
        var timers = new Set();
        var cleanupFns = [];
        var supabaseClient = null;
        var supabaseLoaded = false;
        var lastFrameTs = 0;
        var carSpriteCanvas = null;
        var iconGhosts = [];

        var state = {
            phase: 'idle',
            running: false,
            keys: Object.create(null),
            track: null,
            car: null,
            particles: [],
            currentLap: 0,
            lapSplits: [],
            raceStarted: false,
            raceStartTs: 0,
            lapStartTs: 0,
            introStartTs: 0,
            countdownStartTs: 0,
            nearestTrackIndex: 0,
            prevTrackIndex: 0,
            progressTracker: 0,
            lapProgressForward: 0,
            lapArmed: false,
            prevGateSignedDistance: null,
            wrongWayMs: 0,
            wrongWayFlashUntil: 0,
            offTrackFlashUntil: 0,
            finalTimeMs: 0,
            leaderboard: [],
            visitorCount: null,
            playerName: 'YOU',
            playerRank: -1,
            exitQueued: false,
            emitAccumulator: 0
        };

        function mount() {
            overlay = document.createElement('div');
            overlay.id = 'ee-overlay';
            overlay.setAttribute('tabindex', '0');

            canvas = document.createElement('canvas');
            canvas.id = 'ee-canvas';
            overlay.appendChild(canvas);
            document.body.appendChild(overlay);

            ctx = canvas.getContext('2d');
            resizeCanvas();
            buildTrack();
            resetCar();
            loadCarSprite();
            captureIconGhosts();

            var onResize = function () {
                resizeCanvas();
                var oldIndex = state.nearestTrackIndex;
                buildTrack();
                snapCarToTrack(oldIndex);
                captureIconGhosts();
            };

            var onPointerDown = function () {
                overlay.focus();
            };

            var onKeyDown = function (e) {
                if (nameInput && document.activeElement === nameInput) {
                    return;
                }
                var mapped = mapKey(e.key);
                if (!mapped) {
                    return;
                }
                state.keys[mapped] = true;

                if (mapped === 'escape') {
                    e.preventDefault();
                    queueExit();
                    return;
                }

                if (mapped !== 'unknown') {
                    e.preventDefault();
                }
            };

            var onKeyUp = function (e) {
                var mapped = mapKey(e.key);
                if (!mapped) {
                    return;
                }
                state.keys[mapped] = false;
                if (mapped !== 'unknown') {
                    e.preventDefault();
                }
            };

            window.addEventListener('resize', onResize);
            overlay.addEventListener('pointerdown', onPointerDown);
            overlay.addEventListener('keydown', onKeyDown);
            overlay.addEventListener('keyup', onKeyUp);
            overlay.focus();

            cleanupFns.push(function () {
                window.removeEventListener('resize', onResize);
                overlay.removeEventListener('pointerdown', onPointerDown);
                overlay.removeEventListener('keydown', onKeyDown);
                overlay.removeEventListener('keyup', onKeyUp);
            });
        }

        function showMobileFallback() {
            if (!overlay) {
                return;
            }
            state.phase = 'mobile';
            var message = document.createElement('div');
            message.className = 'ee-mobile-message';
            message.textContent = 'REQUIRES KEYBOARD. COME BACK ON DESKTOP.';
            overlay.appendChild(message);
            addTimer(setTimeout(function () {
                queueExit();
            }, 3000));
        }

        function start() {
            state.phase = 'intro';
            state.running = true;
            state.introStartTs = performance.now();
            lastFrameTs = state.introStartTs;
            rafId = requestAnimationFrame(loop);
        }

        function loop(ts) {
            if (!state.running) {
                return;
            }

            var dt = ts - lastFrameTs;
            if (dt > 48) {
                dt = 48;
            }
            lastFrameTs = ts;

            if (state.phase === 'intro') {
                updateIntro(ts);
            } else if (state.phase === 'countdown') {
                updateCountdown(ts);
            } else if (state.phase === 'racing') {
                updateRacing(ts, dt);
            }

            render(ts);
            rafId = requestAnimationFrame(loop);
        }

        function updateCountdown(ts) {
            var elapsed = ts - state.countdownStartTs;
            if (elapsed >= 4000) {
                state.phase = 'racing';
            }
        }

        function updateIntro(ts) {
            var elapsed = ts - state.introStartTs;
            if (elapsed >= INTRO_VISIBLE_MS) {
                state.phase = 'countdown';
                state.countdownStartTs = ts;
            }
        }

        function updateRacing(ts, dt) {
            var car = state.car;
            var frameScale = dt / 16.6667;

            var accelerating = !!state.keys.up;
            var braking = !!state.keys.down;

            if (accelerating) {
                car.speed += car.acceleration * frameScale;
            } else if (braking) {
                car.speed -= car.acceleration * 0.9 * frameScale;
            } else {
                car.speed *= Math.pow(car.friction, frameScale);
            }

            if (!accelerating && car.speed > 0) {
                car.speed = Math.max(0, car.speed - car.drag * frameScale);
            }
            if (!braking && car.speed < 0) {
                car.speed = Math.min(0, car.speed + car.drag * frameScale);
            }

            car.speed = clamp(car.speed, -car.maxReverse, car.maxSpeed);

            var turning = 0;
            if (state.keys.left) {
                turning -= 1;
            }
            if (state.keys.right) {
                turning += 1;
            }
            if (turning !== 0 && Math.abs(car.speed) > 0.05) {
                var speedFactor = Math.min(1, Math.abs(car.speed) / car.maxSpeed);
                var direction = car.speed >= 0 ? 1 : -1;
                car.angle += turning * car.turnSpeed * speedFactor * frameScale * direction;
            }

            car.x += Math.sin(car.angle) * car.speed * frameScale;
            car.y -= Math.cos(car.angle) * car.speed * frameScale;

            var nearest = findNearestTrackPoint(car.x, car.y);
            state.nearestTrackIndex = nearest.index;

            var distanceToTrack = nearest.distance;
            if (distanceToTrack > state.track.trackWidth / 2 + 5) {
                car.speed *= Math.pow(0.7, frameScale);
                state.offTrackFlashUntil = ts + 500;
            }

            var tangent = state.track.tangents[nearest.index];
            var forwardX = Math.sin(car.angle);
            var forwardY = -Math.cos(car.angle);
            var directionDot = forwardX * tangent.x + forwardY * tangent.y;

            if (directionDot < -0.2 && Math.abs(car.speed) > 0.2) {
                state.wrongWayMs += dt;
                if (state.wrongWayMs >= 1000) {
                    state.wrongWayFlashUntil = ts + 200;
                }
            } else {
                state.wrongWayMs = Math.max(0, state.wrongWayMs - dt * 2);
            }

            updateProgress(nearest.index);

            if (!state.raceStarted && Math.abs(car.speed) > 0.1) {
                state.raceStarted = true;
                state.raceStartTs = ts;
                state.lapStartTs = ts;
                state.lapArmed = false;
            }

            if (state.raceStarted) {
                updateLapDetection(ts, directionDot);
            }

            state.emitAccumulator += dt;
            if (state.emitAccumulator > 70 && Math.abs(car.speed) > 0.35) {
                emitWheelParticles();
                state.emitAccumulator = 0;
            }
            updateParticles(dt);
        }

        function updateProgress(currentIndex) {
            var len = state.track.points.length;
            var delta = currentIndex - state.prevTrackIndex;
            if (delta > len / 2) {
                delta -= len;
            } else if (delta < -len / 2) {
                delta += len;
            }
            state.progressTracker += delta;
            if (delta > 0) {
                state.lapProgressForward += delta;
            }
            state.prevTrackIndex = currentIndex;
        }

        function updateLapDetection(ts, directionDot) {
            var track = state.track;
            var startPoint = track.points[0];
            var startTangent = track.tangents[0];
            var startNormalX = -startTangent.y;
            var startNormalY = startTangent.x;
            var gateDistance = clamp(canvas.width / 1920 * 40, 26, 62);
            var distToStart = distance(state.car.x, state.car.y, startPoint.x, startPoint.y);
            var currentGateSignedDistance =
                (state.car.x - startPoint.x) * startNormalX +
                (state.car.y - startPoint.y) * startNormalY;

            if (distToStart > track.trackWidth * 0.8) {
                state.lapArmed = true;
            }

            var crossedGateFromExpectedSide = false;
            if (state.prevGateSignedDistance !== null) {
                crossedGateFromExpectedSide =
                    state.prevGateSignedDistance < -2 &&
                    currentGateSignedDistance >= 2;
            }
            state.prevGateSignedDistance = currentGateSignedDistance;

            var isNearGate = distToStart <= gateDistance;
            var minProgress = track.points.length * MIN_LAP_PROGRESS_RATIO;
            var enoughProgress = state.lapProgressForward >= minProgress;
            var enoughTime = (ts - state.lapStartTs) >= MIN_LAP_MS;

            if (
                state.lapArmed &&
                isNearGate &&
                crossedGateFromExpectedSide &&
                directionDot > 0.2 &&
                enoughProgress &&
                enoughTime
            ) {
                state.currentLap += 1;
                var split = ts - state.lapStartTs;
                state.lapSplits.push(split);
                state.lapStartTs = ts;
                state.lapArmed = false;
                state.lapProgressForward = 0;

                if (state.currentLap >= TOTAL_LAPS) {
                    finishRace(ts);
                }
            }
        }

        function finishRace(ts) {
            state.phase = 'finished';
            state.running = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }

            state.finalTimeMs = Math.max(0, Math.round(ts - state.raceStartTs));
            renderFinalScreen();

            addTimer(setTimeout(function () {
                showNameEntry();
            }, 1500));
        }

        function showNameEntry() {
            if (!overlay || state.phase === 'exiting') {
                return;
            }
            state.phase = 'name-entry';
            renderNameEntryScreen();

            nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.maxLength = 12;
            nameInput.className = 'ee-name-input';
            nameInput.placeholder = 'TYPE NAME + ENTER';
            nameInput.autocomplete = 'off';
            nameInput.spellcheck = false;

            var handleSubmit = async function (e) {
                if (e.key !== 'Enter') {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        queueExit();
                    }
                    return;
                }

                e.preventDefault();
                var value = (nameInput.value || '').trim();
                state.playerName = sanitizeName(value || 'YOU');
                await submitAndShowLeaderboard();
            };

            nameInput.addEventListener('keydown', handleSubmit);
            cleanupFns.push(function () {
                nameInput.removeEventListener('keydown', handleSubmit);
            });

            overlay.appendChild(nameInput);
            nameInput.focus();
        }

        async function submitAndShowLeaderboard() {
            if (nameInput) {
                nameInput.remove();
                nameInput = null;
            }

            state.phase = 'leaderboard-loading';
            renderLoadingScreen();

            await submitLeaderboardRow();
            var board = await fetchLeaderboard();
            var visitors = await fetchVisitorCount();

            state.leaderboard = board;
            state.visitorCount = visitors;
            state.playerRank = findPlayerRank(board);

            state.phase = 'leaderboard';
            renderLeaderboard();

            addTimer(setTimeout(function () {
                queueExit();
            }, LEADERBOARD_VISIBLE_MS));
        }

        async function submitLeaderboardRow() {
            if (!supabaseClient) {
                return;
            }

            try {
                var laps = state.lapSplits;
                await supabaseClient.from('ee_leaderboard').insert({
                    name: state.playerName,
                    time_ms: state.finalTimeMs,
                    lap1_ms: toIntOrNull(laps[0]),
                    lap2_ms: toIntOrNull(laps[1]),
                    lap3_ms: toIntOrNull(laps[2])
                });
            } catch (err) {
                console.warn('[EasterEgg] Failed to submit leaderboard row:', err);
            }
        }

        async function fetchLeaderboard() {
            var fallback = [{
                name: state.playerName,
                time_ms: state.finalTimeMs,
                isCurrent: true
            }];

            if (!supabaseClient) {
                return fallback;
            }

            try {
                var result = await supabaseClient
                    .from('ee_leaderboard')
                    .select('name, time_ms')
                    .order('time_ms', { ascending: true })
                    .limit(10);

                var data = result && Array.isArray(result.data) ? result.data : [];
                if (!data.length) {
                    return fallback;
                }

                var currentMatched = false;
                var mapped = data.map(function (row) {
                    var rowName = sanitizeName(row.name || 'PLAYER');
                    var rowTime = Math.max(0, Math.round(Number(row.time_ms) || 0));
                    var isCurrent = !currentMatched && rowName === state.playerName && rowTime === state.finalTimeMs;
                    if (isCurrent) {
                        currentMatched = true;
                    }
                    return {
                        name: rowName,
                        time_ms: rowTime,
                        isCurrent: isCurrent
                    };
                });

                if (!currentMatched && mapped.length < 10) {
                    mapped.push({
                        name: state.playerName,
                        time_ms: state.finalTimeMs,
                        isCurrent: true
                    });
                    mapped.sort(function (a, b) {
                        return a.time_ms - b.time_ms;
                    });
                }

                return mapped.slice(0, 10);
            } catch (err) {
                console.warn('[EasterEgg] Failed to fetch leaderboard:', err);
                return fallback;
            }
        }

        async function fetchVisitorCount() {
            if (!supabaseClient) {
                return null;
            }

            try {
                var result = await supabaseClient
                    .from('ee_visitors')
                    .select('*', { count: 'exact', head: true });
                return typeof result.count === 'number' ? result.count : null;
            } catch (err) {
                console.warn('[EasterEgg] Failed to fetch visitor count:', err);
                return null;
            }
        }

        function findPlayerRank(board) {
            for (var i = 0; i < board.length; i++) {
                if (board[i].isCurrent) {
                    return i + 1;
                }
            }
            for (var j = 0; j < board.length; j++) {
                if (board[j].name === state.playerName && board[j].time_ms === state.finalTimeMs) {
                    return j + 1;
                }
            }
            return -1;
        }

        function render(ts) {
            if (!ctx || !canvas) {
                return;
            }
            drawBackground();
            drawGhostIcons();
            drawTrack();
            drawParticles();
            drawCar();
            drawHud(ts);
            drawMiniMap();
            drawStatusFlashes(ts);

            if (state.phase === 'intro') {
                drawIntroPopup();
            } else if (state.phase === 'countdown') {
                drawCountdown(ts);
            }

            drawScanlines();
        }

        function renderFinalScreen() {
            drawBackground();
            drawGhostIcons();
            drawTrack();
            drawCar();
            drawScanlines();

            var lines = [
                'RACE COMPLETE',
                '',
                'YOUR TIME: ' + formatTime(state.finalTimeMs),
                'LAP 1: ' + formatTime(state.lapSplits[0] || 0),
                'LAP 2: ' + formatTime(state.lapSplits[1] || 0),
                'LAP 3: ' + formatTime(state.lapSplits[2] || 0)
            ];
            drawCenteredPanel(lines, canvas.width * 0.58);
        }

        function renderNameEntryScreen() {
            renderFinalScreen();
            drawText(
                'ENTER YOUR NAME:',
                canvas.width / 2 - 230,
                canvas.height * 0.72,
                16,
                '#8bff8b'
            );
            drawText('> ', canvas.width / 2 - 230, canvas.height * 0.78, 14, COLORS.green);
        }

        function renderLoadingScreen() {
            drawBackground();
            drawGhostIcons();
            drawTrack();
            drawCar();
            drawScanlines();
            drawCenteredPanel([
                'UPLOADING RUN...',
                '',
                'PULLING LEADERBOARD...'
            ], canvas.width * 0.52);
        }

        function renderLeaderboard() {
            drawBackground();
            drawGhostIcons();
            drawTrack();
            drawScanlines();

            var lines = [
                '+----------------------------+',
                '|        HALL OF FAME        |',
                '+----------------------------+'
            ];

            var board = state.leaderboard.length ? state.leaderboard : [{
                name: state.playerName,
                time_ms: state.finalTimeMs,
                isCurrent: true
            }];

            for (var i = 0; i < Math.min(10, board.length); i++) {
                var row = board[i];
                var rank = String(i + 1).padStart(2, ' ');
                var name = (row.name || 'PLAYER').slice(0, 12).padEnd(12, ' ');
                var time = formatTime(row.time_ms).padStart(8, ' ');
                var marker = row.isCurrent ? ' <' : '  ';
                lines.push('| ' + rank + '. ' + name + ' ' + time + marker + ' |');
            }

            while (lines.length < 14) {
                lines.push('|                            |');
            }
            lines.push('+----------------------------+');

            drawCenteredPanel(lines, canvas.width * 0.74);

            var peopleText = state.visitorCount === null
                ? '[VISITOR COUNT UNAVAILABLE]'
                : '[' + state.visitorCount + ' PEOPLE FOUND THIS]';
            drawText(
                peopleText,
                Math.max(20, canvas.width / 2 - 190),
                canvas.height * 0.83,
                10,
                COLORS.green
            );

            drawText(
                '[ESC] EXIT',
                Math.max(20, canvas.width / 2 - 60),
                canvas.height * 0.89,
                10,
                COLORS.green
            );
        }

        function drawBackground() {
            ctx.fillStyle = COLORS.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(0,255,0,0.04)';
            for (var y = 0; y < canvas.height; y += 20) {
                for (var x = 0; x < canvas.width; x += 20) {
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        function drawGhostIcons() {
            if (!iconGhosts.length) {
                return;
            }
            ctx.save();
            ctx.globalAlpha = 0.14;
            for (var i = 0; i < iconGhosts.length; i++) {
                var g = iconGhosts[i];
                if (g.img && g.ready) {
                    ctx.drawImage(g.img, g.x, g.y, g.w, g.h);
                } else {
                    ctx.strokeStyle = COLORS.green;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(g.x, g.y, g.w, g.h);
                }
            }
            ctx.restore();
        }

        function drawTrack() {
            var track = state.track;
            var pts = track.points;
            if (!pts.length) {
                return;
            }

            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (var i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.closePath();

            ctx.strokeStyle = COLORS.green;
            ctx.lineWidth = track.trackWidth + 2;
            ctx.stroke();

            ctx.strokeStyle = COLORS.track;
            ctx.lineWidth = track.trackWidth;
            ctx.stroke();

            ctx.strokeStyle = COLORS.green;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([10, 8]);
            ctx.stroke();
            ctx.setLineDash([]);

            drawKerbs();
            drawStartFinishLine();
            ctx.restore();
        }

        function drawKerbs() {
            var track = state.track;
            var pts = track.points;
            var tangents = track.tangents;
            var kerbLen = 8;
            var halfWidth = track.trackWidth * 0.5;
            for (var i = 0; i < pts.length; i += 12) {
                var p = pts[i];
                var t = tangents[i];
                var nx = -t.y;
                var ny = t.x;
                var color = (Math.floor(i / 12) % 2 === 0) ? COLORS.green : COLORS.darkGreen;
                ctx.fillStyle = color;
                ctx.fillRect(p.x + nx * halfWidth - kerbLen / 2, p.y + ny * halfWidth - kerbLen / 2, kerbLen, kerbLen);
                ctx.fillRect(p.x - nx * halfWidth - kerbLen / 2, p.y - ny * halfWidth - kerbLen / 2, kerbLen, kerbLen);
            }
        }

        function drawStartFinishLine() {
            var track = state.track;
            var p = track.points[0];
            var t = track.tangents[0];
            var nx = -t.y;
            var ny = t.x;
            var width = track.trackWidth;
            var steps = Math.max(10, Math.floor(width / 6));
            var stripe = width / steps;

            for (var i = 0; i < steps; i++) {
                var offset = -width / 2 + i * stripe;
                var x = p.x + nx * offset;
                var y = p.y + ny * offset;
                ctx.fillStyle = (i % 2 === 0) ? COLORS.white : COLORS.green;
                ctx.fillRect(x - t.x * 4, y - t.y * 4, 8, 8);
            }
        }

        function drawParticles() {
            for (var i = 0; i < state.particles.length; i++) {
                var part = state.particles[i];
                var alpha = Math.max(0, part.life / part.maxLife);
                ctx.fillStyle = 'rgba(0,255,0,' + alpha.toFixed(3) + ')';
                ctx.fillRect(part.x, part.y, 2, 2);
            }
        }

        function emitWheelParticles() {
            var car = state.car;
            var rearOffsets = [
                { x: -10, y: 14 },
                { x: 10, y: 14 },
                { x: 0, y: 16 }
            ];

            for (var i = 0; i < rearOffsets.length; i++) {
                var point = rotatePoint(rearOffsets[i].x, rearOffsets[i].y, car.angle);
                state.particles.push({
                    x: car.x + point.x,
                    y: car.y + point.y,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: (Math.random() - 0.5) * 0.6,
                    life: 200,
                    maxLife: 200
                });
            }

            if (state.particles.length > 24) {
                state.particles.splice(0, state.particles.length - 24);
            }
        }

        function updateParticles(dt) {
            for (var i = state.particles.length - 1; i >= 0; i--) {
                var p = state.particles[i];
                p.x += p.vx * (dt / 16.6667);
                p.y += p.vy * (dt / 16.6667);
                p.life -= dt;
                if (p.life <= 0) {
                    state.particles.splice(i, 1);
                }
            }
        }

        function drawCar() {
            var car = state.car;
            ctx.save();
            ctx.translate(car.x + 2, car.y + 2);
            ctx.rotate(car.angle);
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 18, 28, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.translate(car.x, car.y);
            ctx.rotate(car.angle);
            if (carSpriteCanvas) {
                var spriteW = clamp(canvas.width * 0.028, 26, 48);
                var spriteH = spriteW * (carSpriteCanvas.height / carSpriteCanvas.width);
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    carSpriteCanvas,
                    -spriteW / 2,
                    -spriteH / 2,
                    spriteW,
                    spriteH
                );
            } else {
                drawFallbackPixelCar();
            }
            ctx.restore();
        }

        function drawFallbackPixelCar() {
            var pixel = 4;
            var rows = CAR_PATTERN.length;
            var cols = CAR_PATTERN[0].length;
            for (var y = 0; y < rows; y++) {
                for (var x = 0; x < cols; x++) {
                    var cell = CAR_PATTERN[y][x];
                    if (cell === '.') {
                        continue;
                    }
                    if (cell === 'G') {
                        ctx.fillStyle = COLORS.green;
                    } else if (cell === 'D') {
                        ctx.fillStyle = COLORS.bodyDark;
                    } else {
                        ctx.fillStyle = COLORS.darkGreen;
                    }
                    ctx.fillRect(
                        (x - cols / 2) * pixel,
                        (y - rows / 2) * pixel,
                        pixel,
                        pixel
                    );
                }
            }
        }

        function drawHud(ts) {
            var lapDisplay = clamp(state.currentLap + 1, 1, TOTAL_LAPS);
            if (state.phase === 'finished' || state.phase === 'name-entry' || state.phase === 'leaderboard' || state.phase === 'leaderboard-loading') {
                lapDisplay = TOTAL_LAPS;
            }

            var elapsed = state.raceStarted
                ? Math.max(0, ts - state.raceStartTs)
                : 0;
            if (state.phase === 'finished' || state.phase === 'name-entry' || state.phase === 'leaderboard' || state.phase === 'leaderboard-loading') {
                elapsed = state.finalTimeMs;
            }

            var best = getBestKnownTime();
            var speedKmh = Math.round(Math.abs(state.car.speed) * 28);

            drawText('LAP  ' + lapDisplay + ' / ' + TOTAL_LAPS, 22, 30, 11, COLORS.green);
            drawText('TIME ' + formatTime(elapsed), 22, 52, 11, COLORS.green);
            drawText('BEST  ' + (best ? formatTime(best) : '--:--.--'), canvas.width - 255, 30, 11, COLORS.green);
            drawText('SPEED ' + String(speedKmh).padStart(3, ' ') + ' KM/H', canvas.width - 255, 52, 11, COLORS.green);

            drawText('[W/UP] ACCEL  [S/DOWN] BRAKE  [A/LEFT] LEFT  [D/RIGHT] RIGHT  [ESC] EXIT',
                Math.max(10, canvas.width / 2 - 370),
                canvas.height - 22,
                9,
                COLORS.green
            );
        }

        function drawMiniMap() {
            var width = 154;
            var height = 58;
            var pad = 18;
            var boxX = canvas.width - width - pad;
            var boxY = canvas.height - height - 42;
            var track = state.track;

            ctx.save();
            ctx.strokeStyle = COLORS.green;
            ctx.lineWidth = 1;
            ctx.strokeRect(boxX, boxY, width, height);

            var minX = track.bounds.minX;
            var minY = track.bounds.minY;
            var spanX = Math.max(1, track.bounds.maxX - minX);
            var spanY = Math.max(1, track.bounds.maxY - minY);
            var scale = Math.min((width - 10) / spanX, (height - 10) / spanY);
            var offsetX = boxX + (width - spanX * scale) / 2;
            var offsetY = boxY + (height - spanY * scale) / 2;

            ctx.beginPath();
            for (var i = 0; i < track.points.length; i++) {
                var p = track.points[i];
                var mx = offsetX + (p.x - minX) * scale;
                var my = offsetY + (p.y - minY) * scale;
                if (i === 0) {
                    ctx.moveTo(mx, my);
                } else {
                    ctx.lineTo(mx, my);
                }
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(0,255,0,0.7)';
            ctx.stroke();

            var carX = offsetX + (state.car.x - minX) * scale;
            var carY = offsetY + (state.car.y - minY) * scale;
            ctx.fillStyle = COLORS.green;
            ctx.fillRect(carX - 2, carY - 2, 4, 4);
            ctx.restore();
        }

        function drawIntroPopup() {
            drawCenteredPanel([
                'RACE RULES',
                '',
                '3 LAPS TO FINISH',
                'ARROWS OR WASD TO DRIVE',
                'ESC TO EXIT'
            ], canvas.width * 0.5);
        }

        function drawStatusFlashes(ts) {
            if (state.wrongWayFlashUntil > ts) {
                drawTextCentered('WRONG WAY', canvas.height * 0.22, 18, COLORS.green);
            }
            if (state.offTrackFlashUntil > ts) {
                drawTextCentered('OFF TRACK', canvas.height * 0.27, 12, COLORS.green);
            }
        }

        function drawCountdown(ts) {
            var elapsed = ts - state.countdownStartTs;
            var value = '';
            var blockStart = 0;
            if (elapsed < 1000) {
                value = '3';
                blockStart = 0;
            } else if (elapsed < 2000) {
                value = '2';
                blockStart = 1000;
            } else if (elapsed < 3000) {
                value = '1';
                blockStart = 2000;
            } else if (elapsed < 4000) {
                value = 'GO!';
                blockStart = 3000;
            }

            if (!value) {
                return;
            }
            var local = elapsed - blockStart;
            var t = clamp(local / 1000, 0, 1);
            var scale = 1.2 - (0.2 * t);
            var alpha = 1 - (t * 0.3);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.fillStyle = 'rgba(0,255,0,' + alpha.toFixed(3) + ')';
            ctx.font = "48px 'Press Start 2P', cursive";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value, 0, 0);
            ctx.restore();
        }

        function drawScanlines() {
            ctx.save();
            ctx.strokeStyle = 'rgba(0,0,0,0.18)';
            ctx.lineWidth = 1;
            for (var y = 0; y < canvas.height; y += 4) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(canvas.width, y + 0.5);
                ctx.stroke();
            }
            ctx.restore();
        }

        function drawCenteredPanel(lines, width) {
            var lineHeight = 20;
            var panelWidth = Math.min(width, canvas.width - 40);
            var panelHeight = lines.length * lineHeight + 26;
            var x = (canvas.width - panelWidth) / 2;
            var y = (canvas.height - panelHeight) / 2;

            ctx.fillStyle = 'rgba(0,0,0,0.82)';
            ctx.fillRect(x, y, panelWidth, panelHeight);
            ctx.strokeStyle = COLORS.green;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, panelWidth, panelHeight);

            for (var i = 0; i < lines.length; i++) {
                var color = COLORS.green;
                if (lines[i].indexOf('<') > -1) {
                    color = '#70ff70';
                }
                drawText(lines[i], x + 18, y + 24 + i * lineHeight, 12, color);
            }
        }

        function drawText(text, x, y, size, color) {
            ctx.font = size + "px 'Press Start 2P', cursive";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = COLORS.black;
            ctx.fillText(text, x + 1, y + 1);
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        }

        function drawTextCentered(text, y, size, color) {
            ctx.font = size + "px 'Press Start 2P', cursive";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = COLORS.black;
            ctx.fillText(text, canvas.width / 2 + 1, y + 1);
            ctx.fillStyle = color;
            ctx.fillText(text, canvas.width / 2, y);
        }

        function queueExit() {
            if (state.exitQueued || state.phase === 'exiting') {
                return;
            }
            state.exitQueued = true;
            state.phase = 'exiting';
            softStopLoop();
            playBodyGlitch(GLITCH_DURATION_MS).then(function () {
                forceCleanup();
            });
        }

        function softStopLoop() {
            state.running = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }

        function forceCleanup() {
            softStopLoop();
            clearManagedTimers();

            while (cleanupFns.length) {
                var fn = cleanupFns.pop();
                try {
                    fn();
                } catch (err) {
                    console.warn('[EasterEgg] Cleanup callback failed:', err);
                }
            }

            if (nameInput) {
                nameInput.remove();
                nameInput = null;
            }
            if (overlay) {
                overlay.remove();
                overlay = null;
            }

            state.keys = Object.create(null);
            document.body.classList.remove('ee-glitch');
            activeSession = null;
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function loadCarSprite() {
            var img = new Image();
            img.onload = function () {
                try {
                    carSpriteCanvas = cleanSpriteBackground(img);
                } catch (err) {
                    console.warn('[EasterEgg] Failed to process car sprite:', err);
                    carSpriteCanvas = null;
                }
            };
            img.onerror = function () {
                console.warn('[EasterEgg] Car sprite failed to load, using fallback.');
                carSpriteCanvas = null;
            };
            img.src = CAR_SPRITE_PATH;
        }

        function cleanSpriteBackground(img) {
            var temp = document.createElement('canvas');
            temp.width = img.width;
            temp.height = img.height;
            var tctx = temp.getContext('2d');
            tctx.drawImage(img, 0, 0);
            var imageData = tctx.getImageData(0, 0, temp.width, temp.height);
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];
                if (r > 225 && g > 225 && b > 225) {
                    data[i + 3] = 0;
                }
            }

            tctx.putImageData(imageData, 0, 0);

            // Trim transparent margins to keep the sprite compact.
            var bounds = findOpaqueBounds(data, temp.width, temp.height);
            if (!bounds) {
                return temp;
            }
            var cropped = document.createElement('canvas');
            cropped.width = bounds.w;
            cropped.height = bounds.h;
            var cctx = cropped.getContext('2d');
            cctx.drawImage(
                temp,
                bounds.x,
                bounds.y,
                bounds.w,
                bounds.h,
                0,
                0,
                bounds.w,
                bounds.h
            );
            return cropped;
        }

        function findOpaqueBounds(data, width, height) {
            var minX = width;
            var minY = height;
            var maxX = -1;
            var maxY = -1;
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var a = data[(y * width + x) * 4 + 3];
                    if (a > 0) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (maxX < minX || maxY < minY) {
                return null;
            }
            return {
                x: minX,
                y: minY,
                w: (maxX - minX) + 1,
                h: (maxY - minY) + 1
            };
        }

        function captureIconGhosts() {
            iconGhosts = [];
            var icons = document.querySelectorAll('.scattered-icons .icon img');
            for (var i = 0; i < icons.length; i++) {
                var icon = icons[i];
                var rect = icon.getBoundingClientRect();
                if (!rect.width || !rect.height) {
                    continue;
                }
                var ghost = {
                    x: rect.left,
                    y: rect.top,
                    w: rect.width,
                    h: rect.height,
                    ready: false,
                    img: null
                };

                var clone = new Image();
                clone.onload = (function (g, imageRef) {
                    return function () {
                        g.ready = true;
                        g.img = imageRef;
                    };
                }(ghost, clone));
                clone.onerror = (function (g) {
                    return function () {
                        g.ready = false;
                    };
                }(ghost));
                clone.src = icon.currentSrc || icon.src;
                iconGhosts.push(ghost);
            }
        }

        function buildTrack() {
            var width = canvas.width;
            var height = canvas.height;
            var points = generateTrackPoints(width, height, 420);
            var tangents = computeTangents(points);
            var bounds = computeBounds(points);
            var trackWidth = clamp(width * (90 / 1920), 50, 132);
            state.track = {
                points: points,
                tangents: tangents,
                bounds: bounds,
                trackWidth: trackWidth
            };
        }

        function resetCar() {
            var startPoint = state.track.points[0];
            var tangent = state.track.tangents[0];
            var angle = Math.atan2(tangent.x, -tangent.y);
            state.car = {
                x: startPoint.x,
                y: startPoint.y,
                angle: angle,
                speed: 0,
                maxSpeed: 5,
                maxReverse: 1.5,
                acceleration: 0.12,
                friction: 0.96,
                drag: 0.012,
                turnSpeed: 0.045
            };
            state.nearestTrackIndex = 0;
            state.prevTrackIndex = 0;
            state.progressTracker = 0;
            state.lapProgressForward = 0;
            state.currentLap = 0;
            state.lapSplits = [];
            state.raceStarted = false;
            state.lapArmed = false;
            state.prevGateSignedDistance = null;
            state.particles = [];
        }

        function snapCarToTrack(prevIndex) {
            if (!state.track || !state.track.points.length || !state.car) {
                return;
            }
            var index = clamp(prevIndex || 0, 0, state.track.points.length - 1);
            var p = state.track.points[index];
            var t = state.track.tangents[index];
            state.car.x = p.x;
            state.car.y = p.y;
            state.car.angle = Math.atan2(t.x, -t.y);
            state.nearestTrackIndex = index;
            state.prevTrackIndex = index;
        }

        function generateTrackPoints(width, height, targetCount) {
            var normalized = TRACK_WAYPOINTS.slice(0, TRACK_WAYPOINTS.length - 1);
            var waypoints = normalized.map(function (pt) {
                return { x: pt[0] * width, y: pt[1] * height };
            });

            var splinePoints = [];
            var segments = 16;
            for (var i = 0; i < waypoints.length; i++) {
                var p0 = waypoints[(i - 1 + waypoints.length) % waypoints.length];
                var p1 = waypoints[i];
                var p2 = waypoints[(i + 1) % waypoints.length];
                var p3 = waypoints[(i + 2) % waypoints.length];

                for (var j = 0; j < segments; j++) {
                    var t = j / segments;
                    splinePoints.push(catmullRom(p0, p1, p2, p3, t));
                }
            }

            return resamplePolyline(splinePoints, targetCount);
        }

        function catmullRom(p0, p1, p2, p3, t) {
            var t2 = t * t;
            var t3 = t2 * t;
            var s = (1 - SPLINE_TENSION) / 2;
            return {
                x:
                    (
                        (-s * p0.x + (2 - s) * p1.x + (s - 2) * p2.x + s * p3.x) * t3 +
                        (2 * s * p0.x + (s - 3) * p1.x + (3 - 2 * s) * p2.x - s * p3.x) * t2 +
                        (-s * p0.x + s * p2.x) * t +
                        p1.x
                    ),
                y:
                    (
                        (-s * p0.y + (2 - s) * p1.y + (s - 2) * p2.y + s * p3.y) * t3 +
                        (2 * s * p0.y + (s - 3) * p1.y + (3 - 2 * s) * p2.y - s * p3.y) * t2 +
                        (-s * p0.y + s * p2.y) * t +
                        p1.y
                    )
            };
        }

        function resamplePolyline(points, targetCount) {
            if (!points.length) {
                return [];
            }

            var cumulative = [0];
            for (var i = 1; i < points.length; i++) {
                cumulative[i] = cumulative[i - 1] + distance(
                    points[i - 1].x, points[i - 1].y,
                    points[i].x, points[i].y
                );
            }
            var total = cumulative[cumulative.length - 1];
            if (total <= 0) {
                return points.slice(0, targetCount);
            }

            var step = total / targetCount;
            var sampled = [];
            var seg = 1;

            for (var s = 0; s < targetCount; s++) {
                var target = s * step;
                while (seg < cumulative.length - 1 && cumulative[seg] < target) {
                    seg++;
                }
                var prevDist = cumulative[seg - 1];
                var nextDist = cumulative[seg];
                var mix = nextDist === prevDist ? 0 : (target - prevDist) / (nextDist - prevDist);
                sampled.push({
                    x: lerp(points[seg - 1].x, points[seg].x, mix),
                    y: lerp(points[seg - 1].y, points[seg].y, mix)
                });
            }

            return sampled;
        }

        function computeTangents(points) {
            var tangents = new Array(points.length);
            for (var i = 0; i < points.length; i++) {
                var prev = points[(i - 1 + points.length) % points.length];
                var next = points[(i + 1) % points.length];
                var dx = next.x - prev.x;
                var dy = next.y - prev.y;
                var mag = Math.hypot(dx, dy) || 1;
                tangents[i] = { x: dx / mag, y: dy / mag };
            }
            return tangents;
        }

        function computeBounds(points) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                if (p.x < minX) minX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.x > maxX) maxX = p.x;
                if (p.y > maxY) maxY = p.y;
            }
            return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        }

        function findNearestTrackPoint(x, y) {
            var points = state.track.points;
            var best = 0;
            var bestDistSq = Infinity;
            for (var i = 0; i < points.length; i++) {
                var dx = points[i].x - x;
                var dy = points[i].y - y;
                var d2 = dx * dx + dy * dy;
                if (d2 < bestDistSq) {
                    best = i;
                    bestDistSq = d2;
                }
            }
            return {
                index: best,
                distance: Math.sqrt(bestDistSq)
            };
        }

        function getBestKnownTime() {
            var best = null;
            for (var i = 0; i < state.leaderboard.length; i++) {
                var row = state.leaderboard[i];
                if (typeof row.time_ms !== 'number') {
                    continue;
                }
                if (best === null || row.time_ms < best) {
                    best = row.time_ms;
                }
            }
            return best;
        }

        async function ensureSupabaseReady() {
            if (supabaseLoaded) {
                return;
            }
            supabaseLoaded = true;

            if (!hasConfiguredSupabase()) {
                return;
            }

            try {
                await loadSupabaseSdk();
                if (!window.supabase || typeof window.supabase.createClient !== 'function') {
                    return;
                }
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                        detectSessionInUrl: false
                    }
                });
            } catch (err) {
                console.warn('[EasterEgg] Supabase init failed:', err);
                supabaseClient = null;
            }
        }

        function hasConfiguredSupabase() {
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                return false;
            }
            return SUPABASE_URL.indexOf('YOUR-PROJECT') === -1 &&
                SUPABASE_ANON_KEY.indexOf('YOUR-ANON-KEY') === -1;
        }

        function loadSupabaseSdk() {
            return new Promise(function (resolve, reject) {
                if (window.supabase && typeof window.supabase.createClient === 'function') {
                    resolve();
                    return;
                }

                var script = document.getElementById('ee-supabase-sdk');
                if (script) {
                    script.addEventListener('load', function () { resolve(); }, { once: true });
                    script.addEventListener('error', function () {
                        reject(new Error('Failed to load Supabase SDK.'));
                    }, { once: true });
                    return;
                }

                script = document.createElement('script');
                script.id = 'ee-supabase-sdk';
                script.src = SUPABASE_CDN_URL;
                script.async = true;
                script.onload = function () { resolve(); };
                script.onerror = function () {
                    reject(new Error('Failed to load Supabase SDK.'));
                };
                document.head.appendChild(script);
            });
        }

        async function recordVisitor() {
            if (!supabaseClient) {
                return;
            }
            try {
                await supabaseClient.from('ee_visitors').insert({});
            } catch (err) {
                console.warn('[EasterEgg] Failed to record visitor:', err);
            }
        }

        function addTimer(id) {
            timers.add(id);
            return id;
        }

        function clearManagedTimers() {
            timers.forEach(function (id) {
                clearTimeout(id);
            });
            timers.clear();
        }

        return {
            mount: mount,
            start: start,
            showMobileFallback: showMobileFallback,
            ensureSupabaseReady: ensureSupabaseReady,
            recordVisitor: recordVisitor,
            forceCleanup: forceCleanup
        };
    }

    function mapKey(key) {
        if (!key) {
            return null;
        }
        var k = key.toLowerCase();
        if (k === 'arrowup' || k === 'w') return 'up';
        if (k === 'arrowdown' || k === 's') return 'down';
        if (k === 'arrowleft' || k === 'a') return 'left';
        if (k === 'arrowright' || k === 'd') return 'right';
        if (k === 'escape') return 'escape';
        return null;
    }

    function formatTime(ms) {
        var total = Math.max(0, Math.round(ms || 0));
        var minutes = Math.floor(total / 60000);
        var seconds = Math.floor((total % 60000) / 1000);
        var hundredths = Math.floor((total % 1000) / 10);
        return String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0') + '.' +
            String(hundredths).padStart(2, '0');
    }

    function sanitizeName(name) {
        return String(name || '')
            .toUpperCase()
            .replace(/[^A-Z0-9 _-]/g, '')
            .trim()
            .slice(0, 12) || 'YOU';
    }

    function toIntOrNull(value) {
        if (typeof value !== 'number' || !isFinite(value)) {
            return null;
        }
        return Math.round(value);
    }

    function rotatePoint(x, y, angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        return {
            x: x * cos - y * sin,
            y: x * sin + y * cos
        };
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function distance(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.hypot(dx, dy);
    }
})();
