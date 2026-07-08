from app.services.rinex_reader import load_navigation
from app.services.satellite_position import calculate_satellite_position

nav = load_navigation()

sat = nav.sel(sv="G01")

position = calculate_satellite_position(sat)

print(position)