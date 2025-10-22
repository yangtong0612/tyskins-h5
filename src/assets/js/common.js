if (window.addEventListener) {
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  window.addEventListener(resizeEvt, function () {
    setHtmlFontSize()
  }, false)
}

function setHtmlFontSize() {
  // 1366是设计稿的宽度，当大于1920时采用1920宽度   1920/16=120    这里将1rem等于16px
  const docEl = document.documentElement
  const clientWidth = docEl.clientWidth
  var deviceWidth = clientWidth > 1920 ? 1920 : clientWidth
  document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + deviceWidth / 120 + 'px !important'
  // 输出设备小于750时，固定font-size为12px；
  if (document.documentElement.clientWidth < 750) {
    /**
      * ================================================
      *   设置根元素font-size
      * 当设备宽度为375(iPhone6)时，根元素font-size=16px; 
      × ================================================
      */
    const refreshRem = function () {
      const clientWidth = window.innerWidth
        || clientWidth
        || document.clientWidth

      if (!clientWidth) return
      let fz = null
      const width = clientWidth
      fz = 10 * width / 360
      docEl.style.fontSize = fz + 'px'
    }

    refreshRem()
    // document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + 12 + 'px !important'
  }
}

setHtmlFontSize()