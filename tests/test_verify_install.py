import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import patch

import verify_install


class VerifyInstallTests(unittest.TestCase):
    def run_check(self, importer):
        with tempfile.TemporaryDirectory() as directory:
            marker = Path(directory) / "app/env/.personaplex-installed"
            marker.parent.mkdir(parents=True)
            marker.touch()
            with patch.object(verify_install, "__file__", str(Path(directory) / "verify_install.py")):
                with patch.object(verify_install.importlib, "import_module", side_effect=importer):
                    try:
                        verify_install.main()
                    except (ImportError, RuntimeError):
                        self.assertFalse(marker.exists(), "failure must invalidate an earlier success")
                        raise
            self.assertTrue(marker.exists())

    def test_success_creates_marker_after_importing_runtime(self):
        imported = []

        def importer(name):
            imported.append(name)
            return types.SimpleNamespace(__version__="2.7.0+cu128", version=types.SimpleNamespace(cuda="12.8"))

        self.run_check(importer)
        self.assertIn("moshi.server", imported)
        self.assertNotIn("sounddevice", imported)

    def test_missing_native_dependency_invalidates_marker(self):
        def importer(name):
            raise ImportError("native dependency missing")

        with self.assertRaises(ImportError):
            self.run_check(importer)

    def test_cpu_or_wrong_cuda_build_invalidates_marker(self):
        for version, cuda in [("2.7.0", None), ("2.4.1+cu124", "12.4"), ("2.7.0+cu126", "12.6")]:
            with self.subTest(version=version, cuda=cuda), self.assertRaises(RuntimeError):
                self.run_check(lambda name: types.SimpleNamespace(
                    __version__=version, version=types.SimpleNamespace(cuda=cuda)))
