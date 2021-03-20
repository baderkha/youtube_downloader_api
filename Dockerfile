FROM public.ecr.aws/lambda/nodejs:12

ARG DIR="/var/task"

COPY . $DIR

RUN yum install -y wget

RUN wget https://yt-dl.org/downloads/latest/youtube-dl  -O  /usr/local/bin/youtube-dl

RUN chmod +x /usr/local/bin/youtube-dl

ENV PATH "$PATH:/usr/local/bin/youtube-dl"

RUN mkdir -p $DIR

RUN npm install

CMD [ "index.handler"]