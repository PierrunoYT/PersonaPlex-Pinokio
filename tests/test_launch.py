import sys
import types
import unittest
from unittest.mock import Mock, patch

import launch


class LaunchTests(unittest.TestCase):
    def test_enforces_loopback_and_preserves_server_options(self):
        run_app = Mock(return_value="finished")
        web = types.SimpleNamespace(run_app=run_app)
        app = object()

        def server(*args, **kwargs):
            self.assertEqual(args, ("moshi.server",))
            self.assertEqual(kwargs, {"run_name": "__main__"})
            self.assertEqual(web.run_app(app, host="0.0.0.0", port=8123), "finished")

        with patch.dict(sys.modules, {"aiohttp": types.SimpleNamespace(web=web)}):
            with patch.object(launch.runpy, "run_module", side_effect=server):
                launch.main()
        run_app.assert_called_once_with(app, host="127.0.0.1", port=8123)
        self.assertIs(web.run_app, run_app)

    def test_restores_aiohttp_after_startup_failure(self):
        web = types.SimpleNamespace(run_app=Mock())
        original = web.run_app
        with patch.dict(sys.modules, {"aiohttp": types.SimpleNamespace(web=web)}):
            with patch.object(launch.runpy, "run_module", side_effect=RuntimeError("startup")):
                with self.assertRaisesRegex(RuntimeError, "startup"):
                    launch.main()
        self.assertIs(web.run_app, original)
