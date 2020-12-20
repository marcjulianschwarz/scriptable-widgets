// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;


// All possible areas:

// Deutschland = brd

// Bayern = bay
// Baden-Wuerttemberg = baw
// Brandenburg/Berlin = bbb
// Hessen = hes
// Sachsen = sac
// Thueringen = thu
// Schleswig-Holstein/Hamburg = shh
// Sachsen-Anhalt = saa
// Rheinland-Pfalz/Saarland = rps
// Nordrhein-Westfalen = nrw
// Niedersachsen/Bremen = nib
// Mecklenburg-Vorpommern = mvp

area = 'brd'

let p = await args.widgetParameter

if(p){  
  area = p
}

url = 'https://www.dwd.de/DWD/wetter/radar/rad_' + area + '_akt.jpg'

req = new Request(url)
img = await req.loadImage()

widget = new ListWidget()
widget.backgroundImage = img
widget.setPadding(0, 0, 0, 0)

widget.presentLarge()
Script.setWidget(widget)
Script.complete()
