// 问题编号范围
var days = moment().diff(moment('2021-11-30'), 'days');
if (days > 291) {
    days = 291
}
const x = 1;
const y = days;

$(function () {

    // 获取URL参数
    const params = new URLSearchParams(window.location.search);
    // 切换显示语言
    var lang = localStorage.getItem('lang');
    if (!lang) { lang = 'zh'; }
    $('#' + lang + 'Tab').addClass('active');
    // 获取问题编号
    var qid = params.get('q');
    if (qid) {
        if (qid == 'random') {
            // 随机问题, 自动生成问题编号
            randomQ();
        } else {
            // 有问题编号, 显示内容
            $('title').text('No.' + qid + ' | ' + $('title').text());
            $.ajax({
                url: '/data/p' + getPageByQid(qid) + '/' + qid.padStart(3, '0') + '.json',
                type: 'get',
                dataType: 'json',
                success: function (question) {
                    // 使用模板
                    var template = '<div class="card text-dark bg-light question"><div class="card-body"><blockquote class="blockquote mb-0 content zh"><p>{{zh}} <span class="zh date">- {{zhd}}</span></p></blockquote></div><div class="card-footer note">{{zhn}}</div></div><div class="card text-dark bg-light question"><div class="card-body"><blockquote class="blockquote mb-0 content ja"><p>{{ja}} <span class="ja date">- {{jad}}</span></p></blockquote></div><div class="card-footer note">{{jan}}</div></div><div class="card text-dark bg-light question"><div class="card-body"><blockquote class="blockquote mb-0 content en"><p>{{en}} <span class="en date">- {{end}}</span></p></blockquote></div><div class="card-footer note">{{enn}}</div></div><div id="pager"class="row text-center"><div class="col"><button id="lastQ"type="button"class="btn btn-light">«上一题</button></div><div class="col"><span class="badge bg-dark">{{qid}}</span></div><div class="col small"><button id="nextQ"type="button"class="btn btn-light">下一题»</button></div></div>';
                    var html = template
                        .replaceAll('{{zh}}', question.zh.content)
                        .replaceAll('{{zhd}}', formatDate(question.date, 'zh'))
                        .replaceAll('{{zhn}}', formatNote(question.zh.note))
                        .replaceAll('{{ja}}', question.ja.content)
                        .replaceAll('{{jad}}', formatDate(question.date, 'ja'))
                        .replaceAll('{{jan}}', formatNote(question.ja.note))
                        .replaceAll('{{en}}', question.en.content)
                        .replaceAll('{{end}}', formatDate(question.date, 'en'))
                        .replaceAll('{{enn}}', formatNote(question.en.note))
                        .replaceAll('{{qid}}', question.qid);
                    // 显示内容
                    $('main').append(html);
                    // 绑定上一页
                    if (question.qid == x) {
                        $('#lastQ').hide();
                    } else {
                        $('#lastQ').on('click', function () {
                            goToQ(question.qid - 1)
                        });
                    }
                    // 绑定下一页
                    if (question.qid == y) {
                        $('#nextQ').hide();
                    } else {
                        $('#nextQ').on('click', function () {
                            goToQ(question.qid + 1)
                        });
                    }
                },
                error: function (data) {
                    // 错误信息
                    $('main').html(data.responseText);
                    $('main').append('<pre>' + data.status + ' ' + data.statusText + '</pre>');
                    console.log(data);
                }
            });
        }
    } else {
        if (params.has('q')) {
            // 空问题编号, 返回主页
            location.href = '/';
        } else {
            // 无问题编号, 显示主页
            // 获取页码
            var pn = params.get('p');
            if (!pn) {
                pn = 1;
            }
            $.ajax({
                url: '/data/p' + pn + '/all/' + lang + '.json',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    $('main').append('<ul id="all" class="list-group mb-3"></ul>');
                    for (question of data) {
                        // 使用模板
                        var template = '<a href="?q={{qid}}" class="list-group-item list-group-item-action"><span class="badge bg-dark">{{qid}}</span> <span class="{{lang}}">{{content}}</span> <span class="{{lang}} date">- {{date}}</span></a>';
                        var html = template
                            .replaceAll('{{qid}}', question.id)
                            .replaceAll('{{lang}}', lang)
                            .replaceAll('{{content}}', question.content)
                            .replaceAll('{{date}}', formatDate(question.date, lang));
                        // 追加内容
                        $('#all').append(html);
                    }
                    // 显示分页
                    showPager(pn);
                },
                error: function (data) {
                    // 错误信息
                    $('main').html(data.responseText);
                    $('main').append('<pre>' + data.status + ' ' + data.statusText + '</pre>');
                    console.log(data);
                }
            });
        }
    }

    // 绑定语言切换按钮
    $('#zhTab, #jaTab, #enTab').on('click', function () {
        var lang = $(this).attr('id').replace('Tab', '');
        setLang(lang);
    });

    // 绑定跳转到随机问题按钮
    $('#random').on('click', function () {
        randomQ();
    });
});

// 设置首页语言
function setLang(lang) {
    localStorage.setItem('lang', lang);
    window.location.reload();
}

// 跳转到问题
function goToQ(qid) {
    location.href = '/?q=' + qid;
}

// 跳转到随机问题
function randomQ() {
    qid = Math.round(Math.random() * (y - x) + x);
    goToQ(qid);
}

// 格式化日期
function formatDate(date, lang) {
    switch (lang) {
        case 'zh':
            // 中文日期格式
            date = moment(date).locale('zh-cn').format('YYYY年MM月DD日(dd)');
            break;
        case 'ja':
            // 日文日期格式
            date = moment(date).locale('ja').format('YYYY年MM月DD日(dd)');
            break;
        case 'en':
            // 英文日期格式
            date = moment(date).locale('en').format('dddd, MMM DD, YYYY');
            break;
        default:
            // 默认日期格式
            break;
    }
    return date;
}

// 格式化笔记
function formatNote(raw) {
    var note = '';
    for (var i = 0; i < raw.length; i++) {
        if (raw[i]) {
            note += '[' + (i + 1) + '] ' + raw[i] + ' ';
        }
    }
    return note;
}

// 根据问题编号获取所在页码
function getPageByQid(qid) {
    return Math.floor((qid - 1) / 30) + 1;
}

// 显示分页
function showPager(pn) {
    var template = '<div class="d-flex justify-content-center"><div class="pagination pagination-sm en mb-3"><div class="page-item pn1"><a class="page-link"href="/?p=1">1~30</a></div><div class="page-item pn2"><a class="page-link"href="/?p=2">31~60</a></div><div class="page-item pn3"><a class="page-link"href="/?p=3">61~90</a></div><div class="page-item pn4"><a class="page-link"href="/?p=4">91~120</a></div><div class="page-item pn5"><a class="page-link"href="/?p=5">121~150</a></div><div class="page-item pn6"><a class="page-link"href="/?p=6">151~180</a></div><div class="page-item pn7"><a class="page-link"href="/?p=7">181~210</a></div><div class="page-item pn8"><a class="page-link"href="/?p=8">211~240</a></div><div class="page-item pn9"><a class="page-link"href="/?p=9">241~270</a></div><div class="page-item pn10"><a class="page-link"href="/?p=10">271~291</a></div></div></div>';
    var html = template;
    $('main').prepend(html);
    $('main').append(html);
    $('.pn' + pn).addClass('active');
}