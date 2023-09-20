🌟🌟🌟 Contributions are welcomed. 🌟🌟🌟

---

# 🏗 Build

To build the deployable package version, run:

`make run-pack`

This will copy only the required files to a designated directory */dist/__VERSION__/*.
Additionally, it will take the contents of this directory and archive it (.zip) as it is expected
by the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions).

*__VERSION__* is in accordance to the [SemVer 2.0](https://semver.org/) versioning format: <MAJOR>_<MINOR>_<PATCH>

# 👀 Develop & Test

[Load the unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

The directory we should choose will be like */path/to/focus/dist/__VERSION__*.

# 🗃 Docs & GitHub Page

The docs, which consist of a landing page and a privacy policy page can be found under [jpedryc.github.io/focus](https://jpedryc.github.io/focus/).

To run it locally:

`make run-docs`

⚠️[http-server](https://www.npmjs.com/package/http-server) needs to be installed (`npm install -g http-server`)