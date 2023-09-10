include .env
export

install-web-ext:
	npm install --global web-ext

run:
	web-ext run --firefox=${FIREFOX_PATH}

build:
	web-ext build -o
