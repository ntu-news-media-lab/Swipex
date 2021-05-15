# SwipeX

SwipeX is a mobile web feature that allows users to read the news more productively by providing bite-sized summaries that are easily comprehensible, which will encourage them to read more stories that they enjoy and be exposed to stories they would not have gravitated to.

## Table of Contents:
1. [Introduction](#1-introduction)
2. [Requirements](#2-requirements)
3. [Setup](#3-setup)
4. [Usage](#4-usage)
5. [Future Iterations](#5-future-iterations)
6. [Acknowledgements](#6-acknowledgements)
7. [Team](#7-team)
8. [License and Attribution](#8-license-and-attribution)


## 1. Introduction
SwipeX aims to:
1. Pique curiosity – it delivers news in summaries to make news reading more productive.
2. Personalisation – it learns the reader’s reading habits and preferred news stories and feeds the user content that interests them.


## 2. Requirements
##### Front-end React app
- Nodejs
- Yarn or npm package manager
- A browser that supports localstorage

##### Backend Django server
- Python Package Installer (https://pypi.org/project/pip/)

## 3. Setup
1. Download and unzip this code repository into your desired file directory
2. Open the command line and navigate to the root of the repository

##### Front-end React app
1. To navigate to the front-end React project:
> cd swipex
2. To install Nodejs dependencies:
> npm install
3. To launch React app:
> npm start

##### Backend Django server
1. To navigate to the back-end Django project:
> cd backend/today
2. To install Python dependencies:
> pip install django <br>
> pip install Django-cors-headers <br>
> pip install djangorestframework
3. To launch the Django server:
> python manage.py runserver



## 4. Usage
##### Watch a demo of SwipeX
[![SwipeX Demo](https://img.youtube.com/vi/C1pb9VR46q0/0.jpg)](https://youtu.be/C1pb9VR46q0 "SwipeX Demo")

#### Key Features
##### User onboarding
User taps on the SwipeX bubble and is introduced to a quick tutorial. The 3 tutorial cards provide information about the functions of SwipeX.
##### Card swiping
Each piece of news is displayed on a card. Users can swipe left to read the next card, swipe right to go back to the previous one, and swipe up to read the full article if interested.
##### Bite-sized summary
A summary of news is provided on each card that enables users to capture the most essential information in a short time.
##### Personalisation
After spending sufficient time on SwipeX, our tool learns the preferences of the user. The tool will start to provide news cards that potentially interest the user.
##### Metrics
SwipeX will collect and store certain types of non-sensitive user data. The number of unique users a day and the number of new users a day can be measured for reach and growth. The number of users who swiped right for more than about 7 cards and the number of returning users within their first week of use is measured to determine the retention rate. Time spent per card is also recorded to personalise the news stories better.

## 5. Future Iterations
We hope to improve the product through further iterations:
+ A save/bookmark function should readers want to read the articles more in-depth at a later time.
+ Editor’s Pick or Popular Read category with curated articles of importance to encourage users to read more widely.
+ Introduce a free subscription or sign-in model to push notifications and collect more data to curate more personalised articles
+ Sophisticated machine learning that will recommend articles to users based on other users of similar reading habits


## 6. Acknowledgements
Ms Jessica Tan and Miss Joan Kelly for their guidance throughout the News Media Lab course.

Our news partners, Amanda Eber and Bryna Sim, from TODAYonline for their continuous support and valuable feedback.

Our industry mentor Janie Octia from CrowdTangle @ Facebook for her expert guidance.

Users from our research process, for providing us with insightful comments and feedback.

Special Thanks: Sheena Bhalla, Data & innovation Strategy, Google News Initiative APAC

## 7. Team
- Journalists: Brandon Alexius Chia, Heather Ho, Tiffany Tan (leader)
- Designers: Bella Dai, Lin Sining
- Developers: Ong Li Han, Koh Luo Hao, Xue Fuguo

## 8. License and Attribution
SwipeX was developed as part of Nanyang Technological University’s News Media Lab curriculum. It is licensed under The MIT License, hence it is free and open-source.

We encourage any and all budding innovators to use SwipeX either commercially or for experimental pet projects. All that we kindly ask is that you retain the News Media Lab branding and display our logo within the product’s interface.

Do reach out to us if you are interested in further contributing to SwipeX, or if you wish to use SwipeX for your organization/news media agency. We actively welcome anyone who is as keen as us to help turn the wonderful ideas of our students into reality.
