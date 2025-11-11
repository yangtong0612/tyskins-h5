const navList = [
	{
		name: '首页',
		path: '/',
		module: 'home',
	},
	{
		name: '游戏',
		module: 'games',
		hasDropdown: true,
		children: [
			{
				name: '追梦升级',
				path: '/upgrade',
				module: 'upgrade',
				icon: 'star',
				badge: null,
			},
			{
				name: '热血对战',
				path: '/battle',
				module: 'battle',
				icon: 'sword',
				badge: 'HOT',
			},
			{
				name: '扫雷战场',
				path: '/mine-sweeping',
				module: 'mineSweeping',
				icon: 'grid',
				badge: null,
			},
		],
	},
    {
				name: 'ROLL房',
				path: '/roll',
				module: 'roll',
				icon: 'box',
				badge: null,
			},
	{
		name: '每日任务',
		path: '/task',
		module: 'task',
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
]

export { navList }
