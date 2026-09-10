"""Run upstream PersonaPlex with an enforced loopback listener."""

import runpy


def main():
    from aiohttp import web

    run_app = web.run_app

    def run_local_app(app, **kwargs):
        # Upstream currently parses --host without forwarding it to aiohttp.
        kwargs["host"] = "127.0.0.1"
        return run_app(app, **kwargs)

    web.run_app = run_local_app
    try:
        runpy.run_module("moshi.server", run_name="__main__")
    finally:
        web.run_app = run_app


if __name__ == "__main__":
    main()
