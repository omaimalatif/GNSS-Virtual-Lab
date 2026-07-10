from datetime import datetime, UTC
import requests
from pathlib import Path
import gzip
import shutil

def download_navigation():

    today = datetime.now(UTC)

    year = today.year
    day = today.timetuple().tm_yday

    filename = f"BRDC00WRD_S_{year}{day:03d}0000_01D_MN.rnx.gz"

    url = (
        f"https://igs.bkg.bund.de/root_ftp/IGS/BRDC/"
        f"{year}/{day:03d}/{filename}"
    )

    

    BASE_DIR = Path(__file__).resolve().parents[3]
    save_folder = BASE_DIR / "datasets" / "navigation"

    save_folder.mkdir(parents=True, exist_ok=True)
    save_folder.mkdir(parents=True, exist_ok=True)

    save_path = save_folder / filename

    print("Downloading...")
    print(url)

    response = requests.get(url, stream=True)

    if response.status_code != 200:
        print("Download failed.")
        return

    with open(save_path, "wb") as file:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                file.write(chunk)

    print("Downloaded successfully!")
    print(save_path)
# Extract the .gz file
    rnx_path = save_path.with_suffix("")

    with gzip.open(save_path, "rb") as f_in:
     with open(rnx_path, "wb") as f_out:
        shutil.copyfileobj(f_in, f_out)

    print("Extracted:")
    print(rnx_path)

if __name__ == "__main__":
    download_navigation()