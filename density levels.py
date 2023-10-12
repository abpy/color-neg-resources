# script to demonstrate calculation of white balance and density balance from two gray patches on a negative scan
# by Aaron Buchler, 2023
# https://github.com/abpy/abpy.github.io

from math import log10

# darker gray patch, lower density (light) negative
r1 = .094
g1 = .131
b1 = .050

# lighter gray patch, higher density (dark) negative
r2 = 0.048
g2 = 0.054
b2 = 0.016

r1 = log10(1 / r1)
g1 = log10(1 / g1)
b1 = log10(1 / b1)
r2 = log10(1 / r2)
g2 = log10(1 / g2)
b2 = log10(1 / b2)

rs = 1 / (r2 - r1)
gs = 1 / (g2 - g1)
bs = 1 / (b2 - b1)

# green channel is 1.0
div = gs
rs = rs / div
gs = gs / div
bs = bs / div


rd = r1 * rs
gd = g1 * gs
bd = b1 * bs

# green channel is 1.0
md = gd
ra = (md - rd) / rs
ga = (md - gd) / gs
ba = (md - bd) / bs


rm = 1 / (10 ** ra)
gm = 1 / (10 ** ga)
bm = 1 / (10 ** ba)

# density add
print("density add")
print(ra)
print(ga)
print(ba)
print()

# linear multiply
print("linear multiply")
print(rm)
print(gm)
print(bm)
print()

# density multiply / linear power
print("density multiply/linear power")
print(rs)
print(gs)
print(bs)
