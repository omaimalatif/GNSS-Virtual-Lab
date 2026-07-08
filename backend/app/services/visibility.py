from app.services.rinex_reader import load_navigation
from app.services.satellite_position import calculate_satellite_position
import math
import numpy as np


def compute_visibility():

    nav = load_navigation()

    # Receiver ECEF coordinates (Islamabad)
    receiver = {
        "x": 1549181.8224859294,
        "y": 5082338.083035286,
        "z": 3517670.831340403
    }

    # Receiver latitude/longitude (radians)
    lat = np.radians(33.6844)
    lon = np.radians(73.0479)

    satellites = []

    for sv in nav.sv.values:

        try:
            # Select first ephemeris record
            eph = nav.sel(sv=sv).isel(time=0)

            # Compute satellite position
            result = calculate_satellite_position(eph)

            # Distance
            distance = calculate_distance(receiver, result)

            # Line-of-sight vector
            dx = result["x"] - receiver["x"]
            dy = result["y"] - receiver["y"]
            dz = result["z"] - receiver["z"]

            # Convert to ENU
            east, north, up = ecef_to_enu(dx, dy, dz, lat, lon)

            # Horizontal distance
            horizontal = np.sqrt(east**2 + north**2)

            # Elevation angle
            elevation = np.degrees(np.arctan2(up, horizontal))

            # Azimuth
            azimuth = np.degrees(np.arctan2(east, north))

            if azimuth < 0:
                azimuth += 360

            # Visibility test
            visible = elevation > 10

            cleaned = {}
            valid = True

            for key, value in result.items():

                if hasattr(value, "item"):
                    value = value.item()

                if isinstance(value, float):
                    if math.isnan(value) or math.isinf(value):
                        valid = False
                        break

                cleaned[key] = value

            if not valid:
                print(f"Skipping {sv} (contains NaN)")
                continue

            # Add new computed values
            cleaned["distance"] = float(distance)
            cleaned["azimuth"] = float(azimuth)
            cleaned["elevation"] = float(elevation)
            cleaned["visible"] = bool(visible)

            satellites.append({
                "satellite": str(sv),
                **cleaned
            })

        except Exception as e:
            print(f"Skipping {sv}: {e}")

    return satellites


def calculate_distance(receiver, satellite):

    dx = satellite["x"] - receiver["x"]
    dy = satellite["y"] - receiver["y"]
    dz = satellite["z"] - receiver["z"]

    distance = np.sqrt(dx**2 + dy**2 + dz**2)

    return float(distance)


def ecef_to_enu(dx, dy, dz, lat, lon):

    east = (
        -np.sin(lon) * dx
        + np.cos(lon) * dy
    )

    north = (
        -np.sin(lat) * np.cos(lon) * dx
        - np.sin(lat) * np.sin(lon) * dy
        + np.cos(lat) * dz
    )

    up = (
        np.cos(lat) * np.cos(lon) * dx
        + np.cos(lat) * np.sin(lon) * dy
        + np.sin(lat) * dz
    )

    return east, north, up