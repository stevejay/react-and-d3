# react-and-d3

## Building the Web site Docker image

The image currently needs to be manually built locally and then pushed to Docker Hub. The image is built and pushed with a tag of `latest`.

First log in to Docker:

```bash
docker login -u middleengine
[enter your password]
```

Then build and push the image:

```bash
docker build --tag middleengine/dataviz-website:latest --file Dockerfile .
docker push middleengine/dataviz-website:latest
```

### Building and running locally

If you want to test building and running the image locally, then run the following command from the project root: `docker-compose up --force-recreate --build --detach`. You should now be able to access the Web site at `http://localhost:6008/`.

## Building and running the storybook locally as a Docker image

```bash
docker-compose --file docker-compose.storybook.yml up --build --detach
```
