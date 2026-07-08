import numpy as np

# WGS84 constants
A = 6378137.0
F = 1 / 298.257223563
E2 = F * (2 - F)


def llh_to_ecef(latitude, longitude, height):

    lat = np.radians(latitude)
    lon = np.radians(longitude)

    N = A / np.sqrt(1 - E2 * np.sin(lat) ** 2)

    X = (N + height) * np.cos(lat) * np.cos(lon)
    Y = (N + height) * np.cos(lat) * np.sin(lon)
    Z = ((1 - E2) * N + height) * np.sin(lat)

    return {
        "x": float(X),
        "y": float(Y),
        "z": float(Z)
    }
    
receiver = llh_to_ecef(
    latitude=33.6844,
    longitude=73.0479,
    height=540
)

print(receiver)