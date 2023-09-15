run-docs:
	http-server ./docs

run-pre-build:
	cp -R background_scripts dist/0_0_1/
	cp -R content_scripts dist/0_0_1/
	cp -R global_scripts dist/0_0_1/
	cp -R icons dist/0_0_1/
	cp -R popup dist/0_0_1/
	cp -R manifest.json dist/0_0_1/manifest.json

run-pack: run-pre-build
	cd dist/0_0_1 && zip -qr -9 -X ../../dist/focus_nazar_0_0_1.zip .