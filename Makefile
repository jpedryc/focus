VERSION_TAG := $(shell jq .version manifest.json | sed -r 's/\./_/g')

run-docs:
	http-server ./docs

run-pre-build:
	cp -R background_scripts dist/$(VERSION_TAG)/
	cp -R content_scripts dist/$(VERSION_TAG)/
	cp -R global_scripts dist/$(VERSION_TAG)/
	cp -R icons dist/$(VERSION_TAG)/
	cp -R popup dist/$(VERSION_TAG)/
	cp -R manifest.json dist/$(VERSION_TAG)/manifest.json

run-pack: run-pre-build
	cd dist/$(VERSION_TAG) && zip -qr -9 -X ../../dist/focus_nazar_$(VERSION_TAG).zip .