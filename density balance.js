// by Aaron Buchler, 2023
// https://github.com/abpy/abpy.github.io

// calculate density balance from foreground and background color
// uses code generated by ScriptingListener plugin

//add exposure
function addExposureLayer(e, o, g) {
    var idMk = charIDToTypeID( "Mk  " );
        var desc84 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref18 = new ActionReference();
            var idAdjL = charIDToTypeID( "AdjL" );
            ref18.putClass( idAdjL );
        desc84.putReference( idnull, ref18 );
        var idUsng = charIDToTypeID( "Usng" );
            var desc85 = new ActionDescriptor();
            var idType = charIDToTypeID( "Type" );
                var desc86 = new ActionDescriptor();
                var idpresetKind = stringIDToTypeID( "presetKind" );
                var idpresetKindType = stringIDToTypeID( "presetKindType" );
                var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
                desc86.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
                var idExps = charIDToTypeID( "Exps" );
                desc86.putDouble( idExps, e );
                var idOfst = charIDToTypeID( "Ofst" );
                desc86.putDouble( idOfst, o );
                var idgammaCorrection = stringIDToTypeID( "gammaCorrection" );
                desc86.putDouble( idgammaCorrection, g );
            var idExps = charIDToTypeID( "Exps" );
            desc85.putObject( idType, idExps, desc86 );
        var idAdjL = charIDToTypeID( "AdjL" );
        desc84.putObject( idUsng, idAdjL, desc85 );
    executeAction( idMk, desc84, DialogModes.NO );
}

// set channel Restrictions
function setChannelRestrictions(r, g, b) {
    var idsetd = charIDToTypeID( "setd" );
        var desc75 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref15 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref15.putEnumerated( idLyr, idOrdn, idTrgt );
        desc75.putReference( idnull, ref15 );
        var idT = charIDToTypeID( "T   " );
            var desc76 = new ActionDescriptor();
            var idchannelRestrictions = stringIDToTypeID( "channelRestrictions" );
                var list6 = new ActionList();

                if (r) {
                var idChnl = charIDToTypeID( "Chnl" );
                var idRd = charIDToTypeID( "Rd  " );
                list6.putEnumerated( idChnl, idRd );}

                if (g) {
                var idChnl = charIDToTypeID( "Chnl" );
                var idGrn = charIDToTypeID( "Grn " );
                list6.putEnumerated( idChnl, idGrn );}

                if (b) {
                var idChnl = charIDToTypeID( "Chnl" );
                var idBl = charIDToTypeID( "Bl  " );
                list6.putEnumerated( idChnl, idBl );}

            desc76.putList( idchannelRestrictions, list6 );
        var idLyr = charIDToTypeID( "Lyr " );
        desc75.putObject( idT, idLyr, desc76 );
    executeAction( idsetd, desc75, DialogModes.NO );
}


// foreground is darker gray patch, lower density (light) negative
var c1 = app.foregroundColor.rgb;
// background is lighter gray patch, higher density (dark) negative
var c2 = app.backgroundColor.rgb;

var r1 = c1.red / 255;
var g1 = c1.green / 255;
var b1 = c1.blue / 255;

var r2 = c2.red / 255;
var g2 = c2.green / 255;
var b2 = c2.blue / 255;

function log10(val) {return Math.log(val) / Math.LN10;}
function log2(val)  {return Math.log(val) / Math.LN2;}

r1 = log10(1 / r1);
g1 = log10(1 / g1);
b1 = log10(1 / b1);
r2 = log10(1 / r2);
g2 = log10(1 / g2);
b2 = log10(1 / b2);

var rs, gs, bs, rd, gd, bd, ra, ga, ba, rm, gm, bm;

rs = 1 / (r2 - r1);
gs = 1 / (g2 - g1);
bs = 1 / (b2 - b1);

// green channel is 1.0
var div = gs;
rs = rs / div;
gs = gs / div;
bs = bs / div;


rd = r1 * rs;
gd = g1 * gs;
bd = b1 * bs;

// green channel is 1.0
var md = gd;
ra = (md - rd) / rs;
ga = (md - gd) / gs;
ba = (md - bd) / bs;

rm = 1 / Math.pow(10, ra);
gm = 1 / Math.pow(10, ga);
bm = 1 / Math.pow(10, ba);

addExposureLayer(log2(rm), 0.0, 1 / rs);
setChannelRestrictions(true, false, false);

addExposureLayer(log2(bm), 0.0, 1 / bs);
setChannelRestrictions(false, false, true);
