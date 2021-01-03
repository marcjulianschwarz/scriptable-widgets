// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;


//#### Start Setup ####
// Get your own api key at: https://api.nasa.gov
const api_key = ""
let api_url = "https://api.nasa.gov/planetary/apod?api_key=" + api_key

let size = config.widgetFamily

//##### End Setup ####

async function getData(url){  
  let request = new Request(url)  
  let data = await request.loadJSON()
  data.explanation = data.explanation.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")[0]
  
  return data
}


async function getImage(url){        
  let img_request = new Request(url)    
  let image = await img_request.loadImage()
  
  return image
}


async function createWidget(data, image){
  let widget = new ListWidget() 
  widget.backgroundImage = image
  widget.addSpacer()
  
  footer = widget.addStack()  
  footer.layoutHorizontally()
      
  desc_stack = footer.addStack()
  desc_stack.layoutVertically()
  
  title_txt = desc_stack.addText(data.title)
  
  if(size == "large" || size == "medium"){
    desc_stack.addSpacer(5)
    explanation_txt = desc_stack.addText(data.explanation)  
    explanation_txt.textColor = Color.white()  
    explanation_txt.font = Font.regularRoundedSystemFont(14)  
    explanation_txt.shadowRadius = 1
    explanation_txt.shadowColor = Color.black()
  }
  
  footer.addSpacer()
  
  title_txt.textColor = Color.white()  
  title_txt.font = Font.boldRoundedSystemFont(18)  

  title_txt.shadowRadius = 1
  title_txt.shadowColor = Color.black()
  
  let widget_url = "http://www.google.com/search?q=" + data.explanation.replaceAll(" ", "+").replace("?", "")
  widget.url = widget_url
    
  return widget
}


async function createErrorWidget(err){  
  let widget = new ListWidget()
  widget.addText("There was an error.")
  txt = widget.addText(err)
  txt.textColor = Color.red()
  
  return widget
}


if(api_key == ""){
  console.error("You must enter an API key at setup")
  let widget = await createErrorWidget("You must enter an API key at setup")
  widget.presentLarge()
  Script.setWidget(widget)
}else{
  try{
    let data = await getData(api_url)  
    let image = await getImage(data.url)  
    let widget = await createWidget(data, image)
    Script.setWidget(widget)
  }catch{
    console.error("There was a problem getting data from API")
    widget = await createErrorWidget("Problem with API, probably video which cant be used in a widget. New picture coming tomorrow.") 
    Script.setWidget(widget)
  }  
}
Script.complete()
