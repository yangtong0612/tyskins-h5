const navList = [
    {
        name: '首页',
        path: '/',
        module: 'home',
    },
    {
        name: 'Games',
        module: 'games',
        children: [
            {
                name: '追梦升级',
                path: '/upgrade',
                module: 'upgrade',
            },
            {
                name: 'ROLL房',
                path: '/roll',
                module: 'roll',
            },
            {
                name: '热血对战',
                path: '/battle',
                module: 'battle',
            },
            {
                name: '扫雷战场',
                path: '/mine-sweeping',
                module: 'mineSweeping',
            }
        ]
    },
    {
        name: '商城',
        path: '/mall',
        module: 'mall',
    },
    {
        name: '推广',
        path: '/promote',
        module: 'promote',
    },
    {
        name: '等级奖励',
        path: '/grade-reward',
        module: 'gradeReward',
    },
    {
        name: '每日签到',
        path: '/user/signin',
        module: 'signin',
    },
    {
        name: '每日任务',
        path: '/task',
        module: 'task',
    },
]

export { navList }