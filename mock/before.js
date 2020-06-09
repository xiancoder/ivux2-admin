module.exports = function (apiRouter) {
    apiRouter.post('/api/system/login', function (req, res) {
        const code = 200
        const msg = ''
        const data = {
            'res': '登录成功',
            'res_code': 1
        }
        const time = +(new Date)
        const result = {code, data, msg, time}
        res.json(result)
    })
    apiRouter.get('/api/super/roleList', function (req, res) {
        const pageIndex = req.query.pageIndex
        const code = 200
        const msg = ''
        const data = {
            'list': [
                {
                    'id': 1, // 主键
                    'nickname': '小' + pageIndex, // 昵称
                    'header': 'http://q1.qlogo.cn/g?b=qq&nk=2546066152&s=100', // 头像
                    'role': 1 // 目前角色 1 超管 2 管理
                },
                { 'id': 2, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 1 },
                { 'id': 3, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 2 },
                { 'id': 4, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 2 },
                { 'id': 5, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 2 },
                { 'id': 6, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 2 },
                { 'id': 7, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 3 },
                { 'id': 8, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 3 },
                { 'id': 9, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 3 },
                { 'id': 10, 'nickname': '小' + pageIndex, 'header': 'http://q1.qlogo.cn/g?b=qq&nk='+(2546066152+parseInt((0.5-Math.random())*1e8))+'&s=100', 'role': 3 }
            ],
            "rowcount": 45, //共多少条数据
        }
        const time = +(new Date)
        const result = {code, data, msg, time}
        setTimeout(function() {
            res.json(result)
        }, 10e3)
    })
}
