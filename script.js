//serviceworkerの設定
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// BGM設定
// BGMと自然音のリスト
const bgmFiles = [
    './BGM/Nodoka.mp3',
    './BGM/Night_Jazz_Piano_Instrumental_Music.mp3',
    './BGM/Natural_Sonic_guiter.mp3',
    './BGM/inaka.mp3'
];

const natureFiles = [
    './Nature/takibi.mp3',
    './Nature/rain.mp3',
    './Nature/seseragi.mp3',
    './Nature/saezuri.mp3',
    './Nature/musinokoe.mp3'
];

// オーディオ設定
const bgm = new Audio();
const nature = new Audio();
let isPlaying = false; // isPlaying ではなく isPlaying を使う

// UI要素
const modeSelect = document.getElementById('modeSelect');
const bgmSelect = document.getElementById('bgmSelect');
const natureSelect = document.getElementById('natureSelect');
const bgmToggle = document.getElementById('bgmToggle');

// 再生モード切り替え時の処理
modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'bgm') {
        bgmSelect.disabled = false;
        natureSelect.disabled = true;
    } else {
        bgmSelect.disabled = true;
        natureSelect.disabled = false;
    }
});

// 初期状態の設定
if (modeSelect.value === 'bgm') {
    bgmSelect.disabled = false;
    natureSelect.disabled = true;
} else {
    bgmSelect.disabled = true;
    natureSelect.disabled = false;
}

// ランダムなBGMをセット
function setRandomBgm() {
    const randomIndex = Math.floor(Math.random() * bgmFiles.length);
    bgm.src = bgmFiles[randomIndex];
}

// ランダムな自然音をセット
function setRandomNature() {
    const randomIndex = Math.floor(Math.random() * natureFiles.length);
    nature.src = natureFiles[randomIndex];
}

// BGMをセット
function setBgm() {
    if (bgmSelect.value === 'random') {
        setRandomBgm();
    } else {
        bgm.src = bgmSelect.value;
    }
}

// 自然音をセット
function setNature() {
    if (natureSelect.value === 'random') {
        setRandomNature();
    } else {
        nature.src = natureSelect.value;
    }
}

// メッセージを表示する関数
function showMessage(message) {
    document.getElementById('message').innerText = message;
}

// BGMのトグル機能
bgmToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgm.pause();
        nature.pause();
        isPlaying = false;
        showMessage('BGM停止中');
    } else {
        if (modeSelect.value === 'bgm') {
            setBgm();  // ここでBGMをセット
            bgm.play();
        } else {
            setNature();  // ここで自然音をセット
            nature.play();
        }
        isPlaying = true;
        showMessage('BGM再生中');
    }
});

// BGMが終わったら次のBGMを再生
bgm.addEventListener('ended', () => {
    setBgm();
    bgm.play();
});

// 自然音が終わったら次の自然音を再生
nature.addEventListener('ended', () => {
    setNature();
    nature.play();
});


// 時報設定（個別のファイルを指定）
const alarmFileAt1700 = './alarm/komoriuta.mp3'; // 17:00（土日）
const alarmFileAt1800 = './alarm/ainoaisatsu.mp3'; // 18:00
const alarmFileAt1900 = './alarm/otomenoinori.mp3'; // 19:00
const alarmFileAt2000 = './alarm/hananowarutu.mp3'; // 20:00
const alarmFileAt2100 = './alarm/canon.mp3'; // 21:00
let alarmAudio = null;

// メッセージを表示する関数
function showMessage(message) {
    document.getElementById('message').innerText = message;
}


/*
// BGMのトグル機能
document.getElementById('bgmToggle').addEventListener('click', () => {
    if (!isPlaying) {
        setRandomBgm();
        bgm.play().then(() => {
            isPlaying = true;
            showMessage('BGM再生中');
        }).catch(error => {
            console.error('BGM再生エラー:', error);
        });
    } else {
        bgm.pause();
        isPlaying = false;
        showMessage('BGM停止中');
    }
});
*/


// 時報の再生とBGMの再開
function playalarmAndResumeBgm(alarmFile) {
    if (isPlaying) {
        alarmAudio = new Audio(alarmFile);
        bgm.pause(); // BGMを一時停止

        alarmAudio.play();
        let message = '';
        if (alarmFile === alarmFileAt1700) {
            message = 'もうすぐ17:00です。';
        } else if (alarmFile === alarmFileAt1800) {
            message = 'もうすぐ18:00です。';
        } else if (alarmFile === alarmFileAt1900) {
            message = 'もうすぐ19:00です。';
        } else if (alarmFile === alarmFileAt2000) {
            message = 'もうすぐ20:00です。';
        } else if (alarmFile === alarmFileAt2100) {
            message = 'もうすぐ21:00です。';
        } else {
            message = '時報のテストです。';
        }
        showMessage(message);

        alarmAudio.addEventListener('ended', () => {
            bgm.play(); // 時報が終わったらBGM再開

            // 時報終了後5分後に「BGM再生中」というメッセージを表示
            setTimeout(() => {
                showMessage('BGM再生中');
            }, 1 * 60 * 1000); // 1分（60000ms）後
        });
    }
}

// 時報タイマー
function checkalarm() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay(); // 曜日を取得 (0:日曜日, 6:土曜日)

    if (!isPlaying) return; // BGMが再生されていないなら実行しない

    // 土日限定、10:00に時報を再生 (day === 0 || day === 6) &&
    if (hours === 16 && minutes === 57) {
        playalarmAndResumeBgm(alarmFileAt1700); // 適切な時報ファイルを指定
    }

    if ((hours === 17 && minutes === 57) ||
        (hours === 18 && minutes === 57) ||
        (hours === 19 && minutes === 54) ||
        (hours === 20 && minutes === 54)) {

        if (day >= 1 && day <= 5 && hours === 17 && minutes === 57) {
            playalarmAndResumeBgm(alarmFileAt1800);
        } else if (day >= 1 && day <= 5 && hours === 18 && minutes === 57) {
            playalarmAndResumeBgm(alarmFileAt1900);
        } else if (day >= 1 && day <= 5 && hours === 19 && minutes === 54) { // 平日（週の月曜日～金曜日）限定、20:00に時報を再生
            playalarmAndResumeBgm(alarmFileAt2000);
        } else if (day >= 1 && day <= 5 && hours === 20 && minutes === 54) { // 平日（週の月曜日～金曜日）限定、21:00に時報を再生
            playalarmAndResumeBgm(alarmFileAt2000);
        }
    }
}

// 定期的に時報をチェック

//setInterval(checkalarm, 60000); // 1分おきにチェック（60000ms）

function checkAlarm() {
    const now = new Date();
    const seconds = now.getSeconds();
    if (seconds === 0) {
        // Call your checkalarm function here
        checkalarm();
    }
    // Calculate the milliseconds until the next 00 second mark
    const delay = (60 - seconds) * 1000;
    setTimeout(checkAlarm, delay);
}

// Start the first check
checkAlarm();


// BGMランダム設定
setRandomBgm();

// セルフで設定する時報の設定
const modal = document.getElementById('modal');
document.getElementById('openModal').addEventListener('click', () => modal.style.display = 'block');
document.getElementById('closeModal').addEventListener('click', () => modal.style.display = 'none');

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
});

document.querySelectorAll('input[name="setType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        document.getElementById('alarmDate').disabled = e.target.value !== 'date';
        document.getElementById('weekdaySelection').style.display = e.target.value === 'weekday' ? 'block' : 'none';
    });
});

document.getElementById('alarmType').addEventListener('change', (e) => {
    document.getElementById('alarmSettings').style.display = e.target.value === 'alarm' ? 'block' : 'none';
});

// セルフで設定する時報の設定
document.getElementById('addalarm').addEventListener('click', () => {
    // モーダルから値を取得
    const time = document.getElementById('alarmTime').value;
    const name = document.getElementById('alarmName').value;
    const file = document.getElementById('alarmFile').value;
    const date = document.getElementById('alarmDate').value;
    const weekdayChecked = Array.from(document.querySelectorAll('#weekdaySelection input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const type = document.getElementById('alarmType').value;
    const bgmOff = !document.getElementById('bgmOff').checked;
    // どちらのモード（曜日指定 or 日付指定）かを判別
    const setType = document.querySelector('input[name="setType"]:checked').value;

    // 警告エリアをクリア
    const warning = document.getElementById('warningMessage');
    warning.textContent = '';
    warning.style.display = 'none';

    // バリデーションチェック
    if (setType === 'date' && !date) {
        warning.textContent = '日付を指定してください。';
    } else if (setType === 'weekday' && weekdayChecked.length === 0) {
        warning.textContent = '少なくとも1つの曜日を選択してください。';
    } else if (!time) {
        warning.textContent = '時刻を指定してください。';
    } else if (!name) {
        warning.textContent = '名称を入力してください。';
    }

    if (warning.textContent) {
        warning.style.display = 'block';
        return; // 処理を中断
    }

    let newalarm = null;

    if (setType === 'weekday') {
        // 曜日指定の場合
        newalarm = {
            date: null,
            time,
            name,
            file,
            days: weekdayChecked, // 曜日配列
            type,
            bgmOff
        };
    } else {
        // 日付指定の場合
        newalarm = {
            date,
            time,
            name,
            file,
            days: [], // 曜日指定はなし
            type,
            bgmOff
        };
    }

    // 新しい時報をデータに追加
    const alarmData = JSON.parse(localStorage.getItem('alarmData')) || [];
    alarmData.push(newalarm);
    localStorage.setItem('alarmData', JSON.stringify(alarmData));

    // リストを更新して表示
    renderalarmList();
    // モーダルを閉じる
    //modal.style.display = 'none';

    // 【追加】一覧タブをアクティブにする
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    document.querySelector('.tab[data-tab="list"]').classList.add('active');
    document.getElementById('list').classList.add('active');

});

// モーダルを閉じたら警告を消す
document.getElementById('closeModal').addEventListener('click', () => {
    const warning = document.getElementById('warningMessage');
    warning.textContent = '';
    warning.style.display = 'none';
});

// 数字から曜日名に変換する関数
function convertToWeekdayName(dayNumber) {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    return weekdays[dayNumber];
}

// ローカルストレージに保存された時報を表示する関数
function renderalarmList() {
    const alarmData = JSON.parse(localStorage.getItem('alarmData')) || [];
    const alarmContainer = document.getElementById('alarmContainer');
    alarmContainer.innerHTML = '';  // 既存の内容をクリア

    alarmData.forEach((alarm, index) => {
        const div = document.createElement('div');
        div.classList.add('alarm-card');

        // 曜日指定の場合、数字を曜日名に変換
        let dateOrDays = alarm.date ? alarm.date :
            alarm.days.length > 0 ? alarm.days.map(day => convertToWeekdayName(parseInt(day))).join(', ') : "指定なし";

        // アラームの場合、BGMのON/OFFを表示
        const bgmStatus = alarm.type === 'alarm' ? `<p class="alarm-info"><strong>BGM:</strong> ${alarm.bgmOff ? 'ON' : 'OFF'}</p>` : '';

        div.innerHTML = `
    <div class="alarm-content">
        <h3 class="alarm-title">${alarm.name}</h3>
        <p class="alarm-info"><strong>タイプ:</strong> ${alarm.type === 'alarm' ? 'アラーム' : 'タイマー'}</p>
        <p class="alarm-info"><strong>日付/曜日:</strong> ${dateOrDays}</p>
        <p class="alarm-info"><strong>時間:</strong> ${alarm.time}</p>
        ${alarm.type === 'alarm' ? `<p class="alarm-info"><strong>ファイル:</strong> ${alarm.file}</p>` : ''}
        ${bgmStatus}
        <button class="delete-btn" onclick="deletealarm(${index})">削除</button>
    </div>
`;
        alarmContainer.appendChild(div);
    });
}

// 時報を削除する関数
function deletealarm(index) {
    const alarmData = JSON.parse(localStorage.getItem('alarmData')) || [];
    alarmData.splice(index, 1);
    localStorage.setItem('alarmData', JSON.stringify(alarmData));
    renderalarmList();
}

// 初期表示で時報リストをレンダリング
renderalarmList();

// ユーザー操作でオーディオの再生許可を得る
document.body.addEventListener("click", () => {
    const silentAudio = new Audio();
    silentAudio.play().catch(error => console.log("オーディオの自動再生が制限されています:", error));
}, { once: true });

// 時報チェック関数
function checkalarm_2() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = now.getDay();
    // localStorageから毎回取得する
    const alarmData = JSON.parse(localStorage.getItem('alarmData')) || [];

    alarmData.forEach((alarm, index) => {
        if (alarm.time === currentTime) {
            if (alarm.date) {
                // 日付指定の場合
                const alarmDate = new Date(alarm.date);
                if (alarmDate.toDateString() === now.toDateString()) {
                    if (alarm.type === 'alarm') {
                        // アラームの場合
                        playAudio(alarm.file, alarm.bgmOff, () => {
                            // 日付指定の場合は削除
                            alarmData.splice(index, 1);
                            localStorage.setItem('alarmData', JSON.stringify(alarmData));
                            renderalarmList();
                        });
                    } else {
                        // タイマーの場合
                        if (isPlaying) {
                            bgm.pause();
                            showMessage('BGM停止中');
                        }
                        // タイマーは発動後すぐに削除
                        alarmData.splice(index, 1);
                        localStorage.setItem('alarmData', JSON.stringify(alarmData));
                        renderalarmList();
                    }
                }
            } else if (alarm.days.includes(String(currentDay))) {
                // 曜日指定の場合
                if (alarm.type === 'alarm') {
                    playAudio(alarm.file, alarm.bgmOff);
                } else {
                    // タイマーの場合
                    if (isPlaying) {
                        bgm.pause();
                        showMessage('BGM停止中');
                    }
                }
            }
        }
    });
}

// 音声再生関数
function playAudio(filePath, BgmOff, onEndedCallback = null) {
    // BGMを停止
    if (isPlaying) {
        bgm.pause();
    }

    const alarmAudio = new Audio(filePath);
    alarmAudio.play().then(() => {
        console.log("時報の再生が開始されました:", filePath);
        alarmAudio.addEventListener('ended', () => {
            // 音楽が終了した後の処理
            if (!bgmOff.checked && isPlaying) {
                bgm.play();
            }
            if (onEndedCallback) {
                onEndedCallback(); // コールバック実行（日付指定の場合は削除）
            }
        });
    }).catch(error => {
        console.error("音声再生エラー:", error);
    });
}

// 1分ごとに時報をチェック
//setInterval(checkalarm_2, 60000);
function checkAlarm2() {
    const now = new Date();
    const seconds = now.getSeconds();
    if (seconds === 0) {
        // Call your checkalarm_2 function here
        checkalarm_2();
    }
    // Calculate the milliseconds until the next 00 second mark
    const delay = (60 - seconds) * 1000;
    setTimeout(checkAlarm2, delay);
}

// Start the first check
checkAlarm2();
