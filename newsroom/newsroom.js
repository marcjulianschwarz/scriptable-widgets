// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;


TXT_COLOR = Color.white()
TITLE = Font.boldRoundedSystemFont(20)

let p = await args.widgetParameter

item = 0;

if(p){  
  item = parseInt(p)
}

const webview = new WebView()

var getDataTFR = `
    function getData(){
      
      var date_xpath = '//div[contains(concat(" ", normalize-space(@class), " "), " tile__timestamp ")]/text()';
      var desc_xpath = '//div[contains(concat(" ", normalize-space(@class), " "), " tile__headline ")]/text()';  
      var link_xpath = '//ul[@class="section-tiles"]/li/a/@href';
      var img_xpath = '//div[@class="tile__media"]/style/text()';
      
      var dates = document.evaluate(date_xpath, document, null, XPathResult.ANY_TYPE, null);
      var descs = document.evaluate(desc_xpath, document, null, XPathResult.ANY_TYPE, null);
      var links = document.evaluate(link_xpath, document, null, XPathResult.ANY_TYPE, null);
      var imgs = document.evaluate(img_xpath, document, null, XPathResult.ANY_TYPE, null);
      
      var data = [[],[],[],[]];
      
      var d = dates.iterateNext();
        while (d) {
            data[0].push(d.nodeValue)
            d = dates.iterateNext();
       }
      
      var de = descs.iterateNext();
        while (de) {
            data[1].push(de.nodeValue)
            de = descs.iterateNext();
       }
      var l = links.iterateNext();
        while (l) {
            data[2].push(l.nodeValue)
            l = links.iterateNext();
       }
      
      var i = imgs.iterateNext();
        while (i) {
            data[3].push(i.nodeValue)
            i = imgs.iterateNext();
       }
            
     
      return data      
    } 
    getData()
`


async function getData(){  
  await webview.loadURL("https://www.apple.com/de/newsroom/")  
  let dataTFR = await webview.evaluateJavaScript(getDataTFR, false)  
  return dataTFR
}

async function getImage(url){  
  let r = new Request(url)
  let image = await r.loadImage()
  return image
}



async function createWidget(){
  
  data = await getData();
  title = data[1][item]
  link_url = "https://www.apple.com" + data[2][item]
  img_url = data[3][item].split("https://")
  
  urls = "";
  for(url of img_url){
    if(url.includes("regular")){
      
      urls = url.split(")")[0]
            
    }
  }

  image = await getImage("https://" + urls)

  widget = new ListWidget()
  
  widget.addSpacer()
  txt_title = widget.addText(title)
    
  txt_title.textColor = TXT_COLOR
  txt_title.font = TITLE
  txt_title.shadowRadius = 2
  txt_title.shadowColor = Color.black()
  
  widget.url = link_url
  widget.backgroundImage = image;
  
  return widget

}


w = await createWidget()
//w.presentLarge()
Script.setWidget(w)
