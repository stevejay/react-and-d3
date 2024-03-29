# React & D3

This project demonstrates how D3 and React can be used together to render SVG data visualisations. D3 is used to calculate the element position data and React is used to actually render them. Animations are implemented using [React Spring](https://react-spring.io/). [Tailwind CSS](https://tailwindcss.com/) is used for styling.

## Deployment

### Building the Web site Docker image

The image is locally build and then pushed to Docker Hub with a tag of `latest`.

First log in to Docker...

```bash
docker login -u middleengine
[enter your password]
```

... then build and push the image:

```bash
docker build --tag middleengine/dataviz-website:latest --file Dockerfile .
docker push middleengine/dataviz-website:latest
```

### Testing the Docker image locally

To test the Web site Docker image locally, run the following command from the project root:

```bash
docker-compose up --force-recreate --build --detach
```

You should now be able to access the Web site at `http://localhost:6008/`.

## Analysis

Memory leak detection:

```bash
npx fuite https://dataviz.middle-engine.com/
```

Lighthouse:

```bash
npx lighthouse --view https://dataviz.middle-engine.com/
```

PageSpeed Insights:

```bash
https://pagespeed.web.dev/report?url=https%3A%2F%2Fdataviz.middle-engine.com%2F&hl=en
```

## Info

- [TypeScript performance info](https://github.com/microsoft/TypeScript/wiki/Performance#writing-easy-to-compile-code)
