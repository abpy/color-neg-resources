# Color Neg Resources
 
#### Resources for processing color negative film scans.

Luts and scripts for processing negative scans in photoshop.

These files can be used with the process described in my post [Scanning Color Negative Film](https://abpy.github.io/2023/08/20/color-neg.html)

### A TLDR
To process a color negative scan you will need:
* A [linear camera profile](https://abpy.github.io/2023/05/20/linear-profiles.html)
* A linear color profile to use as a working space.
  * I recommend `ACEScg-elle-V4-g10` from [elles_icc_profiles](https://github.com/ellelstone/elles_icc_profiles)

The main steps to the process are:
* White balance
  * Compensate for: backlight, film base color, and lighting of individual film frames.
  * Works by multiplying linear raw rgb values.
* Density balance
  * Compensate for difference in dye density between the channels.
  * Works by multiplying density, or a power function on the linear values.
* Invert
  * Invert colors by dividing
  * positive_value = constant / negative_value

### negative to positive 3d lut
The process can be baked into a 3d lut that can be used directly in acr/lightroom.

The python script `neglut.py` will generate a 3d lut cube file that will:
* convert prophoto rgb to linear acescg
* apply density balance and invert
* apply a tone curve (optional)
* convert colors back to prophoto

The lut is limited in what it can do, but can be very useful for quickly getting a finished image or flat positive for editing. The only adjustments that can be used are Exposure and White Balance. Changing any other setting would disrupt the linearity of the negative.

#### To use the script
After you have decided on values to use for density balance in the ACEScg color space,
Open the python file in a text editor.

* set the values of `redScale`, `greenScale`, and `blueScale` to your density balance values.
* change `savename` to the film name or filename you want to use.
* set `paper` to True or False, for weather or not you want to use the paper curve.

``` python
# values for density balance in ACEScg
redScale = 1.0
greenScale = 0.807
blueScale = 0.579

savename = "ektar" # film name

paper = False # True / False: use paper lut
```
Run the script and it will write the .cube file.

In Adobe Camera Raw or Lightroom:
* set white balance to As Shot
* select the linear camera profile
* option/alt click the new preset button
* change the profile name
* select the Color Lookup Table checkbox
* choose the new cube file
* set Space to ProPhoto RGB
* set Amount Min and Max to 100

![create profile dialog](/create_profile.png)
