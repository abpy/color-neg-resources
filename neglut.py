# by Aaron Buchler, 2023
# https://github.com/abpy/color-neg-resources

from math import log10


# values for density balance in ACEScg
redScale = 1.0
greenScale = 0.807
blueScale = 0.579

savename = "ektar" # film name

paper = False # True / False: use paper lut

if paper:
    savename += "_paper"
else:
    savename += "_flat"

savename = savename + ".cube"
print(savename)


# replaces numpy.dot
def dot(m, v):
    v1 = v[0] * m[0][0] + v[1] * m[0][1] + v[2] * m[0][2]
    v2 = v[0] * m[1][0] + v[1] * m[1][1] + v[2] * m[1][2]
    v3 = v[0] * m[2][0] + v[1] * m[2][1] + v[2] * m[2][2]
    return (v1, v2, v3)

# prophoto to acescg
prophoto_to_acescg = [
    [ 1.1690967, -0.0351612, -0.1340422],
    [-0.0670773,  1.0756683, -0.0085294],
    [ 0.0094233, -0.0133536,  1.0036796]]

# acescg to prophoto
acescg_to_prophoto = [
    [ 0.85612489, 0.02940731, 0.11458606],
    [ 0.05332874, 0.93158451, 0.01503882],
    [-0.00732843, 0.0121183,  0.99545816]]


# load paperlut
with open("paper_a.cube") as fcube:
    cubecurve = fcube.readlines()[10:]
curve = [p.split(" ") for p in cubecurve]
curve = [float(p[0]) for p in curve]
#print(max(curve))
curve = [p / max(curve) for p in curve]

t_size = len(curve) - 1
#print(t_size)

#rescale so green is 1.0
scalef = greenScale
redScale = redScale / scalef
greenScale = greenScale / scalef
blueScale = blueScale / scalef

#cube
cubeRes = 32
cube = ""
cube += "# prophoto 1.8\n"
cube += "LUT_3D_SIZE " + str(cubeRes) + "\n"
cube += "DOMAIN_MIN 0 0 0\n"
cube += "DOMAIN_MAX 1 1 1\n"
for b in range(cubeRes):
    b = b / (cubeRes-1)
    for g in range(cubeRes):
        g = g / (cubeRes-1)
        for r in range(cubeRes):
            r = r / (cubeRes-1)

            rgb = [r, g, b]
            
            # prophoto 1.8 to linear acescg
            rgb = [ch ** 1.8 for ch in rgb]
            rgb = dot(prophoto_to_acescg, rgb)

            rgb = [max(.0001, ch) for ch in rgb]
            rgb = [log10(1 / ch) for ch in rgb]

            #scale density
            rgb = [rgb[0] * redScale, rgb[1] * greenScale, rgb[2] * blueScale]

            if paper: #paper curve
                base_exposure =  0.43
                rgbn = []
                for ch in rgb:
                    ch += base_exposure
                    idx = int(round((ch / 3) * t_size))
                    idx = min(idx, t_size)
                    v = curve[idx]
                    rgbn.append(v)
                rgb = rgbn

            else: #flat
                rgb = [(10 ** ch) * .01 for ch in rgb]


            # linear acescg to prophoto 1.8
            rgb = dot(acescg_to_prophoto, rgb)
            rgb = [min(max(ch, 0), 1) for ch in rgb]
            rgb = [ch ** (1 / 1.8) for ch in rgb]

            rgb = [round(ch, 5) for ch in rgb]
            cube += f"{rgb[0]} {rgb[1]} {rgb[2]}\n"

#write cube
with open(savename, "w") as cf:
    cf.write(cube)
