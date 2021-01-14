// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;

// ###### Setup #######
FONT = Font.regularRoundedSystemFont(13)
SYMB = Font.regularRoundedSystemFont(10)


let TXT_COLOR = Color.dynamic(new Color("#000000"), new Color("#ffffff"))
let BG_COLOR = Color.dynamic(new Color("#ffffff"), new Color("#161618"))
let BOX_COLOR = Color.dynamic(new Color("#161618", 0.1), new Color("#ffffff", 0.1))


TITLE = Font.boldRoundedSystemFont(15)


// ###### End setup ########

const URL_ROAD = "https://www.cameroncounty.us/spacex/"  
const URL_TFR = "https://tfr.faa.gov/tfr2/list.jsp"
const URLS = [URL_ROAD, URL_TFR]
const webview = new WebView()


var getDataTFR = `
    function getData(){
      a = []
      x = document.getElementsByTagName("a")
      for(s of x){
        if(s.innerText.startsWith("BROWNSVILLE")){
          a.push(s.innerText)
         }
      }
      return a      
    } 
    getData()
`
  
var getDataRoad = `
  function getData(){
    var tds = document.getElementsByTagName("td")
    var data = []
    for (td of tds){
      data.push(td.innerText)
    }
    return data
  } 
  getData()
`

async function processRoadData(response){
  data = []
  for(r of response){
    
    if(r == "Closure Canceled"){
      data.push("âŒ")
    }else if(r == "Closure Scheduled"){
      data.push("âœ…")
    }else if(r.includes(",")){
      date = r.split(",")
      data.push(date[1])
    }
  }
  return data
}

async function getProcessedData(for_){  

  if(for_ == "TFR"){
    await webview.loadURL(URL_TFR)
    let dataTFR = await webview.evaluateJavaScript(getDataTFR, false)      
    let processedDataTFR = [];
  
    for (tfr of dataTFR){
      processedDataTFR.push(tfr.split(","))  
    }
  
    console.log(processedDataTFR)
    return processedDataTFR
    
  }else if(for_ == "Road"){
    await webview.loadURL(URL_ROAD)
    let dataRoad = await webview.evaluateJavaScript(getDataRoad, false)    
    let processedDataRoad = await processRoadData(dataRoad)  
    
    console.log(processedDataRoad)    
    return processedDataRoad
  }else{
    console.error("Invalid input for Processed Data")
    return "Invalid" 
  }
}


async function createStackTFR(widget){
  
  dataTFR = await getProcessedData("TFR")

  stack = widget.addStack()
  stack.layoutVertically()
  
  title = stack.addText("Brownsville TFR")
  stack.addSpacer(5)
  
  for(tfr of dataTFR){
    txt_stack = stack.addStack()
    txt = txt_stack.addText("- " + tfr[3])
    txt.font = FONT
    txt.color = TXT_COLOR
    
    for(option of tfr){
      if(option.includes("New")){
        txt.textColor = Color.orange()
        txt_new = txt_stack.addText(" (New)")
        txt_new.textColor = Color.orange()
        txt_new.font = FONT
      }  
    }
  }
  
  title.font = TITLE
  title.color = TXT_COLOR
  
  stack.setPadding(10, 10, 10, 10)
  stack.cornerRadius = 10
  stack.backgroundColor = BOX_COLOR
  
  return widget

}

async function createStackRoad(widget){
  
  dataRoad = await getProcessedData("Road")
  
  stack = widget.addStack()
  stack.layoutVertically()
  
  title = stack.addText("Road Closures")
  stack.addSpacer(5)
  
  for(var i = 0; i < dataRoad.length - 2; i=i+2){
    
    txt_stack = stack.addStack()
    txt = txt_stack.addText(dataRoad[i])
    txt_stack.addSpacer()
    symb = txt_stack.addText(dataRoad[i + 1])
    
    txt.font = FONT
    symb.font = SYMB
    
    txt.color = TXT_COLOR
    
  }
  
  title.font = TITLE
  title.color = TXT_COLOR
  
  stack.setPadding(10, 10, 10, 10)
  stack.cornerRadius = 10
  stack.backgroundColor = BOX_COLOR
  
  return widget
}


async function createWidget(){
  widget = new ListWidget()
  
  two = widget.addStack()
  
  two = await createStackTFR(two)
  two.addSpacer()
  two = await createStackRoad(two)
  
  widget.backgroundColor = BG_COLOR
  
  return widget
}


w = await createWidget()
w.presentMedium()
Script.setWidget(w)
Script.complete()
