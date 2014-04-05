for i in range(15):
    for j in range(15):
        print """
.tile.tile-position-{i}-{j} {{
  -webkit-transform: translate({i121}px, {j121}px);
  -moz-transform: translate({i121}px, {j121}px);
  transform: translate({i121}px, {j121}px); }}""".format(
              i=i,
              j=j,
              i121=i*121,
              j121=j*121,
            )
