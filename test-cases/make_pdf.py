import os
import subprocess
import sys
import tempfile
import shutil

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_file = os.path.join(base_dir, "04_assault_conflicting_accounts.html")
    pdf_file = os.path.join(base_dir, "04_assault_conflicting_accounts.pdf")

    if not os.path.exists(html_file):
        print(f"Error: HTML file {html_file} does not exist")
        sys.exit(1)

    browsers = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]

    browser_bin = None
    for b in browsers:
        if os.path.exists(b):
            browser_bin = b
            break

    if not browser_bin:
        print("No compatible browser found")
        sys.exit(1)

    temp_profile = tempfile.mkdtemp(prefix="pdf_profile_")
    print(f"Using browser: {browser_bin}")
    print(f"Temp profile: {temp_profile}")

    cmd = [
        browser_bin,
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--no-first-run",
        "--no-default-browser-check",
        f"--user-data-dir={temp_profile}",
        f"--print-to-pdf={pdf_file}",
        html_file
    ]

    print("Running command:", " ".join(cmd))
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        print("Return code:", res.returncode)
    except Exception as e:
        print("Process exception:", e)
    finally:
        shutil.rmtree(temp_profile, ignore_errors=True)

    if os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 1000:
        print(f"SUCCESS: PDF generated at: {pdf_file}")
        print(f"PDF size: {os.path.getsize(pdf_file)} bytes")
    else:
        print(f"FAILURE: PDF was not generated or too small")
        if os.path.exists(pdf_file):
            print("File size:", os.path.getsize(pdf_file))
        sys.exit(1)

if __name__ == "__main__":
    main()
