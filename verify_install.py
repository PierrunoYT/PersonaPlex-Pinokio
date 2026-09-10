"""Check the installed runtime before enabling the launcher's Start menu."""

import importlib
from pathlib import Path


def main():
    marker = Path(__file__).resolve().parent / "app/env/.personaplex-installed"
    marker.unlink(missing_ok=True)
    for name in (
        "torch", "torchvision", "torchaudio", "moshi.models", "aiohttp",
        "sphn", "sentencepiece", "sounddevice",
    ):
        importlib.import_module(name)
    torch = importlib.import_module("torch")
    if torch.__version__.split("+")[0] != "2.7.0" or torch.version.cuda != "12.8":
        raise RuntimeError("PersonaPlex requires the launcher's PyTorch 2.7.0 CUDA 12.8 build. Run Install again.")
    marker.touch()
    print("PersonaPlex runtime verified.")


if __name__ == "__main__":
    main()
