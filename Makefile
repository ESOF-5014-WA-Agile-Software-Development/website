ifndef version
	version=latest
endif

default:
	@echo "nothing to do..."

build:
	@echo "start yarn build..."
	yarn && yarn build

image:
	@echo "start building docker image..."
	docker build -t agile-website:$(version) .
	# TODO push

.PHONY: zip

zip:
	rm -rf ./zip
	rm -rf website.zip
	mkdir -p zip
	cp -r ./components ./zip
	cp -r ./data ./zip
	cp -r ./ether ./zip
	cp -r ./lib ./zip
	cp -r ./pages ./zip
	cp -r ./public ./zip
	cp -r ./store ./zip
	cp -r ./styles ./zip
	cp -r ./.eslintrc.json ./zip
	cp -r ./next-env.d.ts ./zip
	cp -r ./package.json ./zip
	cp -r ./tsconfig.json ./zip
	cp -r ./yarn.lock ./zip
	cp -r ./next.config.prod.js ./zip/next.config.js
	zip -q -r website.zip ./zip
	rm -rf ./zip

clear:
	rm -rf ./zip
	rm website.zip
