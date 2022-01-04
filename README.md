# React & D3

This project demonstrates how D3 and React can be used together to render SVG data visualisations. D3 is used to calculate the element position data and React is used to actually render them. Animations are implemented using [Framer Motion](https://www.framer.com/motion/). Styling is added using [Tailwind CSS](https://tailwindcss.com/).

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

## Storybook

To build and run the Storybook Docker image locally, run the following command from the project root:

```bash
docker-compose --file docker-compose.storybook.yml up --force-recreate --build --detach
```
