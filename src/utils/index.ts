import { RoomItem } from "@/types/roll";
import defaultAvatar from "@/assets/img/battle/robot-avatar.jpg";
import NP from 'number-precision'
export * from "./date";

export function countDown(timestamp: number | string) {
  const now = new Date().getTime();
  const end = new Date(Number(timestamp) * 1000).getTime();
  const diff = end - now;
  let day = 0,
    hour = 0,
    minute = 0,
    second = 0;
  if (diff > 0) {
    day = Math.floor(diff / (1000 * 60 * 60 * 24));
    hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    second = Math.floor((diff % (1000 * 60)) / 1000);
  }
  return {
    day,
    hour,
    minute,
    second,
  };
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function colorRgb(color: string, opacity = 1) {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  color = color.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    var colorChange: number[] = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
    }
    colorChange.push(opacity);
    return "rgba(" + colorChange.join(",") + ")";
  } else {
    return color;
  }
}

export function processImageUrl(image: string) {
  if (!image || image.indexOf("http") !== -1 || image.indexOf("/battle/robot-avatar") > -1) {
    return image;
  }

  let baseUrl = import.meta.env.VITE_OSS_URL as string;
  // let baseUrl = import.meta.env.VITE_BASE_URL as string;

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  if (image.startsWith('/')) {
    image = image.slice(1);
  }

  return baseUrl + '/' + image;
}

export function processRoomItem(roomItem: RoomItem) {
  let { room_type, nickname, avatar } = roomItem;
  if (room_type === 0) {
    nickname = "Ai";
    avatar = defaultAvatar;
  } else {
    avatar = processImageUrl(avatar);
  }

  return {
    ...roomItem,
    nickname,
    avatar,
  };
}

export const sleep = (n: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
};

export function isMobile() {
  let userAgentInfo = navigator.userAgent;

  let mobileAgents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];

  let mobile_flag = false;

  //根据userAgent判断是否是手机
  for (let v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }
  return mobile_flag;
}

export function formatPassTime(startTime) {
  let currentTime = Date.parse(new Date()),
    time = currentTime - startTime,
    day = parseInt(time / (1000 * 60 * 60 * 24)),
    hour = parseInt(time / (1000 * 60 * 60)),
    min = parseInt(time / (1000 * 60)),
    month = parseInt(day / 30),
    year = parseInt(month / 12);
  if (year) return year + "年前";
  if (month) return month + "个月前";
  if (day) return day + "天前";
  if (hour) return hour + "小时前";
  if (min) return min + "分钟前";
  else return "刚刚";
}

export function formatRemainTime(endTime) {
  var startDate = new Date(); //开始时间
  var endDate = new Date(endTime); //结束时间
  var t = endDate.getTime() - startDate.getTime(); //时间差
  var d = 0,
    h = 0,
    m = 0,
    s = 0;
  if (t >= 0) {
    d = Math.floor(t / 1000 / 3600 / 24);
    h = Math.floor((t / 1000 / 60 / 60) % 24);
    m = Math.floor((t / 1000 / 60) % 60);
    s = Math.floor((t / 1000) % 60);
  }
  return {
    d,
    h,
    m,
    s,
  };
}

export function shuffle(arr) {
  arr = arr.slice();
  var tmp,
    cur,
    top = arr.length;
  if (top)
    while (--top) {
      cur = Math.floor(Math.random() * (top + 1));
      tmp = arr[cur];
      arr[cur] = arr[top];
      arr[top] = tmp;
    }
  return arr;
}

export const parseSimpleTreeData = (treeData, { id, pId, rootPId }) => {
	const keyNodes = {};
	const rootNodeList = [];
	// Fill in the map
	const nodeList = treeData.map(node => {
		const clone = { ...node };
		const key = clone[id];
		keyNodes[key] = clone;
		clone.key = clone.key || key;
		return clone;
	});
	// Connect tree
	nodeList.forEach(node => {
		const parentKey = node[pId];
		const parent = keyNodes[parentKey];
		// Fill parent
		if (parent) {
			parent.children = parent.children || [];
			parent.children.push(node);
		}
		// Fill root tree node
		if (parentKey === rootPId || (!parent && rootPId === null)) {
			rootNodeList.push(node);
		}
	});
	return rootNodeList;
};

export const openLink = (link: string) => {
  let a: any = document.createElement('a');
  a.href = link;
  a.target = "_blank";
  a.click()

  setTimeout(() => {
    a = null
  }, 300)
}

export const times = (num1, num2) => {
  return NP.times(num1, num2)
}