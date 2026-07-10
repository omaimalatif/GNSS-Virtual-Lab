from pathlib import Path
import requests

BASE_DIR = Path(__file__).resolve().parents[3]

ORBIT_FOLDER = BASE_DIR / "datasets" / "orbits"
ORBIT_FOLDER.mkdir(parents=True, exist_ok=True)


def download_sp3():

    url = (
        "https://igs.bkg.bund.de/root_ftp/IGS/products/mgex/"
        "COD0OPSFIN_20261910000_01D_05M_ORB.SP3.gz"
    )

    save_path = ORBIT_FOLDER / "latest.sp3.gz"

    print("Downloading SP3...")

    response = requests.get(url, stream=True)

    if response.status_code != 200:
        print("Download failed.")
        print(response.status_code)
        return

    with open(save_path, "wb") as file:
        for chunk in response.iter_content(8192):
            if chunk:
                file.write(chunk)

    print("Download successful!")
    print(save_path)


if __name__ == "__main__":
    download_sp3()