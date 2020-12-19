// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;

//#### Setup: ####
// Get your own api key at: https://api.nasa.gov

const api_key = "X3ZzhLCX44ZzyoUk49hQjrmN39SSapkH3FRggoN3"
let api_url = "https://api.nasa.gov/planetary/apod?api_key=" + api_key

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
  desc_stack.addSpacer(5)
  explanation_txt = desc_stack.addText(data.explanation)
  
  footer.addSpacer()
  
  title_txt.textColor = Color.white()  
  title_txt.font = Font.regularRoundedSystemFont(18)  
  explanation_txt.textColor = Color.white()  
  explanation_txt.font = Font.regularRoundedSystemFont(14)
  
  let widget_url = "http://www.google.com/search?q=" + data.explanation.replaceAll(" ", "+").replace("?", "")
  widget.url = widget_url
    
  return widget
}

let data = await getData(api_url)
let image = await getImage(data.hdurl)
let widget = await createWidget(data, image)

Script.setWidget(widget)
Script.complete()
